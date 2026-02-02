import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Badge } from '../../ui/Badge';
import { Alert, AlertDescription } from '../../ui/Alert';
import { Separator } from '../../ui/Separator';
import { Entity } from './Step8Entities';

interface Step28FinalReviewProps {
    wizardData: any;
    setCurrentStep: (step: number) => void;
}

// Helper components for a richer summary view
const SummaryItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-start gap-4">
        <p className="text-text-secondary flex-shrink-0">{label}</p>
        <div className="font-medium text-right break-words">{value}</div>
    </div>
);

const DetailButton: React.FC<{ step: number; onEdit: (step: number) => void; children: React.ReactNode }> = ({ step, onEdit, children }) => (
    <Button variant="ghost" size="sm" className="w-full justify-start text-accent hover:text-accent-hover" onClick={() => onEdit(step)}>
        {children}
    </Button>
);

const SummaryCard: React.FC<{
  title: string;
  icon: string;
  step: number;
  onEdit: (step: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
  summaryItems: { label: string; value: React.ReactNode }[];
  children: React.ReactNode;
}> = ({ title, icon, step, onEdit, isExpanded, onToggle, summaryItems, children }) => {
  return (
    <Card className={`bg-sidebar/50 transition-all duration-300 ease-in-out ${isExpanded ? 'ring-2 ring-accent shadow-lg' : 'hover:ring-1 hover:ring-card-border'}`}>
      <div className="cursor-pointer" onClick={onToggle}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <Icon name={icon} className="h-6 w-6 text-accent" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Icon name={isExpanded ? 'chevronUp' : 'chevronDown'} className="h-5 w-5 text-text-secondary" />
        </CardHeader>
        <CardContent className="text-sm space-y-2 pt-2">
            {summaryItems.map(item => <SummaryItem key={item.label} label={item.label} value={item.value} />)}
        </CardContent>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 animate-in fade-in-50 duration-500">
            <Separator className="my-4" />
            <div className="space-y-4">
              <h4 className="font-semibold text-text-primary mb-2">Details</h4>
              {children}
            </div>
        </div>
      )}
    </Card>
  );
};


const Step28FinalReview: React.FC<Step28FinalReviewProps> = ({ wizardData, setCurrentStep }) => {
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const handleToggle = (cardTitle: string) => {
        setExpandedCard(prev => (prev === cardTitle ? null : cardTitle));
    };
    
    // --- Data Extraction ---
    const { step1: vision, step2: type, step3: arch, step4: stack, step5: auth, step6: users, step7: perms } = wizardData;
    const { step8: entities, step10: relationships, step13: apis } = wizardData;
    const { step15: screens, step17: layout, step18: theme } = wizardData;
    const { step19: notifications, step20: search, step21: reports } = wizardData;
    const { step23: seo, step24: perf, step25: security, step26: tests, step27: deploy } = wizardData;
    
    // --- Validation Logic ---
    const validationIssues = [];
    if (!vision?.systemName) validationIssues.push({ message: "System Name is missing.", step: 1 });
    if (!entities?.entities || entities.entities.length === 0) {
        validationIssues.push({ message: "No entities have been defined.", step: 8 });
    } else {
        entities.entities.forEach((e: any) => {
            if (e.fields.length === 0) {
                validationIssues.push({ message: `Entity "${e.name}" has no fields.`, step: 9 });
            }
        });
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Final Review</h2>
                <p className="text-text-secondary">Review your entire system model below. Expand any section for details or to jump back and make changes.</p>
            </div>
            
            {validationIssues.length > 0 && (
                 <Alert className="border-yellow-500/50 bg-yellow-500/10">
                    <Icon name="alertCircle" className="h-5 w-5 text-yellow-500" />
                    <AlertDescription className="text-yellow-500/80">
                      <h4 className="font-bold mb-1">Potential Issues Found</h4>
                      <ul className="list-disc pl-5 space-y-1">
                          {validationIssues.map(issue => (
                            <li key={issue.message}>
                                {issue.message} <Button variant="ghost" size="sm" className="h-auto p-0 ml-2 text-yellow-400 hover:text-yellow-300" onClick={() => setCurrentStep(issue.step)}>Fix it</Button>
                            </li>
                          ))}
                      </ul>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SummaryCard title="Planning" icon="eye" step={1} onEdit={setCurrentStep} isExpanded={expandedCard === 'Planning'} onToggle={() => handleToggle('Planning')}
                    summaryItems={[
                        { label: "System Name", value: vision.systemName },
                        { label: "System Type", value: type.systemType },
                        { label: "Architecture", value: arch.architecture },
                        { label: "User Roles", value: users.userTypes.length },
                    ]}>
                    <SummaryItem label="User Roles" value={<div className="flex flex-wrap gap-1 justify-end">{users.userTypes.map((u:any) => <Badge key={u.id} variant="secondary">{u.name}</Badge>)}</div>} />
                    <SummaryItem label="Tech Stack" value={<div className="flex flex-wrap gap-1 justify-end">{[...(stack.frontend || []), ...(stack.backend || []), ...(stack.database || [])].map((t:string) => <Badge key={t} variant="outline">{t}</Badge>)}</div>} />
                    <SummaryItem label="Auth Providers" value={auth.providers.join(', ')} />
                    <DetailButton step={6} onEdit={setCurrentStep}>Edit User Roles</DetailButton>
                </SummaryCard>
                
                 <SummaryCard title="Data Model" icon="database" step={8} onEdit={setCurrentStep} isExpanded={expandedCard === 'Data Model'} onToggle={() => handleToggle('Data Model')}
                    summaryItems={[
                        { label: "Entities", value: entities.entities.length },
                        { label: "Relationships", value: relationships.relationships.length },
                        { label: "API Endpoints", value: apis.endpoints.length },
                    ]}>
                    <div className="space-y-1">
                      {entities.entities.map((e: Entity) => <SummaryItem key={e.id} label={e.name} value={<Badge variant="outline">{e.fields.length} fields</Badge>} />)}
                    </div>
                    <DetailButton step={8} onEdit={setCurrentStep}>Edit Entities & Fields</DetailButton>
                    <DetailButton step={13} onEdit={setCurrentStep}>Edit API Endpoints</DetailButton>
                </SummaryCard>

                <SummaryCard title="Interface & UX" icon="layout" step={15} onEdit={setCurrentStep} isExpanded={expandedCard === 'Interface & UX'} onToggle={() => handleToggle('Interface & UX')}
                    summaryItems={[
                        { label: "Main Layout", value: layout.navigation },
                        { label: "Theme", value: <div className="flex items-center gap-2 justify-end"><div className="w-4 h-4 rounded-full border border-card-border" style={{backgroundColor: theme.primaryColor}} /><span>{theme.fontFamily}</span></div> },
                        { label: "Screens", value: screens.screens.length },
                    ]}>
                    <div className="space-y-1">
                      {screens.screens.map((s: any) => <SummaryItem key={s.id} label={s.path} value={s.layout} />)}
                    </div>
                    <DetailButton step={17} onEdit={setCurrentStep}>Edit Layout & Theme</DetailButton>
                    <DetailButton step={15} onEdit={setCurrentStep}>Edit Screens</DetailButton>
                </SummaryCard>

                <SummaryCard title="Functionalities" icon="puzzle" step={19} onEdit={setCurrentStep} isExpanded={expandedCard === 'Functionalities'} onToggle={() => handleToggle('Functionalities')}
                    summaryItems={[
                        { label: "Notification Channels", value: notifications.channels.length },
                        { label: "Global Search", value: search.globalSearch.enabled ? "Enabled" : "Disabled" },
                        { label: "Reports", value: reports.reports.length },
                    ]}>
                    <SummaryItem label="Notification Channels" value={<div className="flex flex-wrap gap-1 justify-end">{notifications.channels.map((c:string) => <Badge key={c} variant="secondary">{c}</Badge>)}</div>} />
                    <SummaryItem label="Defined Reports" value={reports.reports.length > 0 ? reports.reports.map((r:any) => r.name).join(', ') : 'None'} />
                    <DetailButton step={19} onEdit={setCurrentStep}>Edit Notifications</DetailButton>
                    <DetailButton step={21} onEdit={setCurrentStep}>Edit Reports</DetailButton>
                </SummaryCard>

                <SummaryCard title="Tech Requirements" icon="shield" step={23} onEdit={setCurrentStep} isExpanded={expandedCard === 'Tech Requirements'} onToggle={() => handleToggle('Tech Requirements')}
                    summaryItems={[
                        { label: "Performance Target", value: `${perf.lighthouse.performance}/100` },
                        { label: "Security", value: <span className="text-green-400">HTTPS Enabled</span> },
                        { label: "Testing Levels", value: tests.levels.length },
                    ]}>
                    <SummaryItem label="SEO" value={seo.sitemap ? "Sitemap Enabled" : "Sitemap Disabled"} />
                    <SummaryItem label="Protections" value={<div className="flex flex-wrap gap-1 justify-end">{security.vulnerabilities.map((v:string) => <Badge key={v} variant="secondary">{v.split(' ')[0]}</Badge>)}</div>} />
                    <DetailButton step={24} onEdit={setCurrentStep}>Edit Performance</DetailButton>
                    <DetailButton step={25} onEdit={setCurrentStep}>Edit Security</DetailButton>
                    <DetailButton step={26} onEdit={setCurrentStep}>Edit Tests</DetailButton>
                </SummaryCard>

                <SummaryCard title="Deployment" icon="server" step={27} onEdit={setCurrentStep} isExpanded={expandedCard === 'Deployment'} onToggle={() => handleToggle('Deployment')}
                    summaryItems={[
                        { label: "Environments", value: deploy.environments.length },
                        { label: "CI/CD", value: deploy.ciCd },
                        { label: "Hosting", value: deploy.hosting },
                    ]}>
                    <SummaryItem label="Environments" value={deploy.environments.join(', ')} />
                    <SummaryItem label="Monitoring Tools" value={<div className="flex flex-wrap gap-1 justify-end">{deploy.monitoring.map((m:string) => <Badge key={m} variant="outline">{m}</Badge>)}</div>} />
                     <DetailButton step={27} onEdit={setCurrentStep}>Edit Deployment</DetailButton>
                </SummaryCard>
            </div>
        </div>
    );
};

export default Step28FinalReview;