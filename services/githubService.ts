
import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";

export interface GithubFile {
    path: string;
    content: string;
}

export class GitHubService {
  private octokit: any;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async getRepo(owner: string, repo: string) {
    return await this.octokit.repos.get({ owner, repo });
  }

  async pushFiles(owner: string, repo: string, branch: string, message: string, files: GithubFile[]) {
    // 1. Obter a referência da branch (ou criar se for a primeira vez)
    let latestCommitSha: string;
    try {
      const { data: refData } = await this.octokit.git.getRef({ owner, repo, ref: `heads/${branch}` });
      latestCommitSha = refData.object.sha;
    } catch (e) {
      // Se a branch não existir, precisamos de um commit inicial (geralmente via create repo ou push manual)
      // Aqui assumimos que o repo já existe e tem pelo menos um commit (ou main branch)
      throw new Error(`A branch ${branch} não foi encontrada. Certifique-se de que o repositório foi inicializado.`);
    }

    // 2. Obter a árvore do último commit
    const { data: commitData } = await this.octokit.git.getCommit({ owner, repo, commit_sha: latestCommitSha });
    const baseTreeSha = commitData.tree.sha;

    // 3. Criar Blobs para cada arquivo (processamento em paralelo)
    const treeItems = await Promise.all(files.map(async (file) => {
      const { data: blobData } = await this.octokit.git.createBlob({
        owner,
        repo,
        content: btoa(unescape(encodeURIComponent(file.content))),
        encoding: 'base64'
      });
      return {
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blobData.sha
      };
    }));

    // 4. Criar uma nova Árvore
    const { data: newTreeData } = await this.octokit.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree: treeItems
    });

    // 5. Criar o Commit
    const { data: newCommitData } = await this.octokit.git.createCommit({
      owner,
      repo,
      message,
      tree: newTreeData.sha,
      parents: [latestCommitSha]
    });

    // 6. Atualizar a Referência da Branch
    return await this.octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommitData.sha
    });
  }
}
