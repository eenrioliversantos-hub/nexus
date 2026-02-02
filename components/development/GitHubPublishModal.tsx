
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogCloseButton } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import Icon from '../shared/Icon';
import { GitHubService, GithubFile } from '../../services/githubService';

interface GitHubPublishModalProps {
    open: boolean;
    onClose: () => void;
    files: GithubFile[];
}

const GitHubPublishModal: React.FC<GitHubPublishModalProps> = ({ open, onClose, files }) => {
    const [token, setToken] = useState('');
    const [status, setStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [progress, setProgress] = useState(0);

    const OWNER = "eenrioliversantos-hub";
    const REPO = "nexus";

    const handlePublish = async () => {
        if (!token) return;
        setStatus('publishing');
        setProgress(10);
        setErrorMessage('');

        try {
            const gh = new GitHubService(token);
            
            setProgress(30);
            // Verificar se o repo existe
            await gh.getRepo(OWNER, REPO);
            
            setProgress(50);
            // Subir os arquivos
            await gh.pushFiles(OWNER, REPO, 'main', 'feat: nexus platform project upload', files);
            
            setProgress(100);
            setStatus('success');
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setErrorMessage(error.message || 'Erro ao conectar com o GitHub. Verifique seu Token.');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Icon name="share" className="text-accent" />
                    Subir para GitHub (nexus)
                </DialogTitle>
                <DialogDescription>
                    Isso enviará todos os artefatos gerados para o repositório <strong>{OWNER}/{REPO}</strong>.
                </DialogDescription>
                <DialogCloseButton />
            </DialogHeader>
            
            <DialogContent className="space-y-4">
                {status === 'idle' && (
                    <>
                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20 mb-4">
                            <p className="text-xs text-accent leading-relaxed">
                                <Icon name="info" className="inline h-3 w-3 mr-1 mb-0.5" />
                                <strong>Arquivos preparados:</strong> {files.length} (incluindo Frontend, Backend e Docs).
                                <br />
                                O projeto será compatível com <strong>GitHub Copilot</strong> e <strong>Vite</strong>.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gh-token">GitHub Personal Access Token (PAT)</Label>
                            <Input 
                                id="gh-token" 
                                type="password" 
                                placeholder="ghp_xxxxxxxxxxxx" 
                                value={token} 
                                onChange={e => setToken(e.target.value)} 
                            />
                            <p className="text-[10px] text-text-secondary">
                                Requer permissão `repo`. Gere um em github.com/settings/tokens
                            </p>
                        </div>
                    </>
                )}

                {status === 'publishing' && (
                    <div className="py-8 text-center space-y-4">
                        <Icon name="spinner" className="h-10 w-10 animate-spin text-accent mx-auto" />
                        <p className="text-sm font-medium">Sincronizando com {REPO}...</p>
                        <div className="w-full bg-sidebar rounded-full h-2 overflow-hidden">
                            <div className="bg-accent h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="py-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                            <Icon name="check" className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold">Upload Concluído!</h3>
                        <p className="text-sm text-text-secondary">
                            Seu código está pronto no GitHub. Agora você pode terminar o ERP com o Copilot no seu ambiente local.
                        </p>
                        <Button onClick={onClose} className="w-full">Fechar</Button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="py-4 text-center space-y-4">
                        <Icon name="alertCircle" className="h-10 w-10 text-red-500 mx-auto" />
                        <p className="text-sm text-red-400">{errorMessage}</p>
                        <Button variant="outline" onClick={() => setStatus('idle')} className="w-full">Tentar Novamente</Button>
                    </div>
                )}
            </DialogContent>

            {status === 'idle' && (
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handlePublish} disabled={!token}>
                        Iniciar Push
                    </Button>
                </DialogFooter>
            )}
        </Dialog>
    );
};

export default GitHubPublishModal;
