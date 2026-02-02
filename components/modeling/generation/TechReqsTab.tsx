import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import Icon from '../../shared/Icon';

interface TechReqsTabProps {
    wizardData: any;
}

const SummaryItem: React.FC<{ label: string, value?: string | React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-text-secondary">{label}</p>
        <div className="font-semibold">{value || <span className="text-xs italic text-text-secondary/80">Not specified</span>}</div>
    </div>
);

const TechReqsTab: React.FC<TechReqsTabProps> = ({ wizardData }) => {
    const seo = wizardData.step23;
    const perf = wizardData.step24;
    const sec = wizardData.step25;
    const tests = wizardData.step26;
    const deploy = wizardData; // The merged object from PlanSummaryView
    
    const hasData = (obj: any) => obj && Object.values(obj).some(v => Array.isArray(v) ? v.length > 0 : v);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>SEO & Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!hasData(seo) && !hasData(perf) ? (
                        <p className="text-sm text-center text-text-secondary py-4">Data from steps 23 & 24 will appear here.</p>
                    ) : (
                        <>
                            <SummaryItem label="Sitemap & robots.txt" value={
                                <div className="flex gap-4">
                                    <span>Sitemap: {seo.sitemap ? 'Yes' : 'No'}</span>
                                    <span>robots.txt: {seo.robotsTxt ? 'Yes' : 'No'}</span>
                                </div>
                            } />
                            <SummaryItem label="Meta Tags" value={
                                seo.metaTags?.length > 0 ? <div className="flex flex-wrap gap-1">{seo.metaTags.map((t:string) => <Badge key={t} variant='secondary'>{t}</Badge>)}</div> : undefined
                            } />
                            <SummaryItem label="Lighthouse Targets" value={`Perf: ${perf.lighthouse?.performance}, A11y: ${perf.lighthouse?.accessibility}, SEO: ${perf.lighthouse?.seo}`} />
                            <SummaryItem label="Optimizations" value={
                                <div className="flex flex-wrap gap-1">
                                    {perf.imageOptimization && <Badge variant='outline'>Images</Badge>}
                                    {perf.codeSplitting && <Badge variant='outline'>Code Split</Badge>}
                                    {perf.lazyLoading && <Badge variant='outline'>Lazy Load</Badge>}
                                </div>
                            } />
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {!hasData(sec) ? (
                        <p className="text-sm text-center text-text-secondary py-4">Data from step 25 will appear here.</p>
                    ) : (
                        <>
                            <SummaryItem label="HTTPS & CSP" value={
                                <div className="flex gap-4">
                                    <span>HTTPS: {sec.https ? 'Yes' : 'No'}</span>
                                    <span>CSP: {sec.csp ? 'Yes' : 'No'}</span>
                                </div>
                            } />
                            <SummaryItem label="Rate Limiting" value={sec.rateLimiting ? 'Enabled' : 'Disabled'} />
                            <SummaryItem label="CORS Origins" value={<code className="text-xs">{sec.corsOrigins}</code>} />
                            <SummaryItem label="Protections" value={
                                sec.vulnerabilities?.length > 0 ? <div className="flex flex-wrap gap-1">{sec.vulnerabilities.map((v:string) => <Badge key={v} variant='secondary'>{v}</Badge>)}</div> : undefined
                            } />
                        </>
                    )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Testing Strategy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!hasData(tests) ? (
                        <p className="text-sm text-center text-text-secondary py-4">Data from step 26 will appear here.</p>
                    ) : (
                        <>
                            <SummaryItem label="Testing Levels" value={
                                tests.levels?.length > 0 ? <div className="flex flex-wrap gap-1">{tests.levels.map((l:string) => <Badge key={l} variant='secondary'>{l}</Badge>)}</div> : undefined
                            } />
                            <SummaryItem label="Frameworks" value={`Unit: ${tests.unitFramework || 'N/A'}, E2E: ${tests.e2eFramework || 'N/A'}`} />
                            <SummaryItem label="Code Coverage Target" value={`${tests.coverageTarget || 'N/A'}%`} />
                        </>
                    )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Deployment & Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {!deploy.hostingProvider && !(deploy.environments?.length > 0) ? (
                        <p className="text-sm text-center text-text-secondary py-4">Data from deploy tool will appear here.</p>
                    ) : (
                        <>
                            <SummaryItem label="Environments" value={
                                deploy.environments?.length > 0 ? <div className="flex flex-wrap gap-1">{deploy.environments.map((e:string) => <Badge key={e} variant='secondary'>{e}</Badge>)}</div> : undefined
                            } />
                            <SummaryItem label="CI/CD & Hosting" value={`${deploy.deployStrategy || 'N/A'} on ${deploy.hostingProvider || 'N/A'}`} />
                            <SummaryItem label="Monitoring Tools" value={
                                deploy.monitoring?.length > 0 ? <div className="flex flex-wrap gap-1">{deploy.monitoring.map((m:string) => <Badge key={m} variant='outline'>{m}</Badge>)}</div> : undefined
                            } />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TechReqsTab;