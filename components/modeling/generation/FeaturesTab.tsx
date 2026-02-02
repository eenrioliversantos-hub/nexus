import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import Icon from '../../shared/Icon';

interface FeaturesTabProps {
    wizardData: any;
}

const EmptyState: React.FC<{ message: string, step: number }> = ({ message, step }) => (
    <div className="text-center py-4">
        <p className="text-xs italic text-text-secondary">{message}</p>
        <p className="text-xs text-text-secondary">Complete Step {step} to see the summary here.</p>
    </div>
);

const FeaturesTab: React.FC<FeaturesTabProps> = ({ wizardData }) => {
    const notificationsData = wizardData.step19;
    const searchData = wizardData.step20;
    const reportsData = wizardData.step21;
    const analyticsData = wizardData.step22;

    const hasNotifications = notificationsData.channels.length > 0 || notificationsData.events.length > 0;
    const hasSearch = searchData.globalSearch.enabled || searchData.filters.length > 0;
    const hasReports = reportsData.reports.length > 0;
    const hasAnalytics = analyticsData.tools.length > 0;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                    {hasNotifications ? (
                        <>
                            <p className="text-sm text-text-secondary mb-2">Enabled Channels:</p>
                            <div className="flex flex-wrap gap-2">
                                {notificationsData.channels.map((channel: string) => (
                                    <Badge key={channel} variant="secondary">{channel}</Badge>
                                ))}
                            </div>
                            <p className="text-sm text-text-secondary mt-4 mb-2">Notification Events:</p>
                            <p className="text-xs italic text-text-secondary">No events defined.</p>
                        </>
                    ) : (
                        <EmptyState message="No notification channels or events defined." step={19} />
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Search & Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    {hasSearch ? (
                        <>
                            <p className="text-sm text-text-secondary">Global Search:</p>
                            <p className="font-semibold">{searchData.globalSearch.enabled ? 'Enabled' : 'Disabled'}</p>
                            {searchData.globalSearch.enabled && (
                                <>
                                 <p className="text-sm text-text-secondary mt-2">Searchable Entities:</p>
                                 <p className="text-xs italic text-text-secondary">No searchable entities defined.</p>
                                </>
                            )}
                        </>
                    ) : (
                         <EmptyState message="No search or filter configurations defined." step={20} />
                    )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Reports & Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                    {hasReports ? (
                        <>
                             <p className="text-sm text-text-secondary mb-2">Defined Reports:</p>
                             <p className="text-xs italic text-text-secondary">Report summary not yet implemented.</p>
                        </>
                    ) : (
                         <EmptyState message="No reports defined." step={21} />
                    )}
                     
                    <div className="border-t border-card-border mt-4 pt-4">
                        {hasAnalytics ? (
                            <>
                                 <p className="text-sm text-text-secondary mt-4 mb-2">Analytics Tools:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {analyticsData.tools.map((tool: string) => (
                                        <Badge key={tool} variant="secondary">{tool}</Badge>
                                    ))}
                                </div>
                            </>
                        ) : (
                             <EmptyState message="No analytics tools selected." step={22} />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FeaturesTab;