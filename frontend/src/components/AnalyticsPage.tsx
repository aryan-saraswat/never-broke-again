import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Briefcase, MessageSquare, Award, XCircle, ArrowLeft } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useBoardStore } from '../store/useBoardStore';
import { selectFunnelStats } from '../store/analyticsSelectors';

const FunnelBar = ({ label, count, total, color }: { label: string; count: number; total: number; color: string }) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="funnel-bar-row">
            <div className="funnel-bar-label">
                <span className="funnel-bar-name">{label}</span>
                <span className="funnel-bar-count">{count}</span>
            </div>
            <div className="funnel-bar-track">
                <div
                    className="funnel-bar-fill"
                    style={{ width: `${pct}%`, background: color }}
                />
            </div>
            <span className="funnel-bar-pct">{pct}%</span>
        </div>
    );
};

const StatCard = ({ icon, label, value, sub }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    sub?: string
}) => (
    <div className="stat-card glass-panel">
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-body">
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-label">{label}</div>
            {sub && <div className="stat-card-sub">{sub}</div>}
        </div>
    </div>
);

const AnalyticsPage = () => {
    const navigate = useNavigate();
    const stats = useBoardStore(useShallow(selectFunnelStats));

    const {
        totalApplied,
        totalInterviews,
        totalOffers,
        totalRejected,
        totalWishlist,
        responseRate,
        interviewRate,
        offerRate,
    } = stats;

    const totalAll = totalApplied + totalWishlist;

    return (
        <div className="analytics-page">
            <header className="app-header"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn-secondary icon-btn" onClick={() => navigate('/')}>
                        <ArrowLeft size={16} />
                    </button>
                    <h1 className="app-title">Analytics</h1>
                </div>
                <span className="analytics-subtitle">{totalAll} total job{totalAll !== 1 ? 's' : ''} tracked</span>
            </header>

            <div className="analytics-content">
                {totalApplied === 0 ? (
                    <div className="analytics-empty">
                        <TrendingUp size={48} strokeWidth={1} />
                        <p>No applications yet. Start tracking jobs to see your funnel.</p>
                    </div>
                ) : (
                    <>
                        <section className="analytics-section">
                            <h2 className="analytics-section-title">Overview</h2>
                            <div className="stat-cards-grid">
                                <StatCard
                                    icon={<Briefcase size={20} />}
                                    label="Total Applied"
                                    value={totalApplied}
                                    sub="excluding wishlist"
                                />
                                <StatCard
                                    icon={<MessageSquare size={20} />}
                                    label="Interview Rate"
                                    value={`${interviewRate}%`}
                                    sub={`${totalInterviews} interview${totalInterviews !== 1 ? 's' : ''}`}
                                />
                                <StatCard
                                    icon={<Award size={20} />}
                                    label="Offer Rate"
                                    value={`${offerRate}%`}
                                    sub={`${totalOffers} offer${totalOffers !== 1 ? 's' : ''}`}
                                />
                                <StatCard
                                    icon={<XCircle size={20} />}
                                    label="Rejections"
                                    value={totalRejected}
                                    sub={`${responseRate}% response rate`}
                                />
                            </div>
                        </section>

                        <section className="analytics-section">
                            <h2 className="analytics-section-title">Application Funnel</h2>
                            <p className="analytics-section-desc">How your applications progress through each stage, as
                                a share of total applied.</p>
                            <div className="funnel-chart glass-panel">
                                <FunnelBar label="Applied"
                                           count={totalApplied}
                                           total={totalApplied}
                                           color="var(--status-applied)" />
                                <FunnelBar label="Interviewing"
                                           count={totalInterviews}
                                           total={totalApplied}
                                           color="var(--status-interview)" />
                                <FunnelBar label="Offer"
                                           count={totalOffers}
                                           total={totalApplied}
                                           color="var(--status-offer)" />
                                <FunnelBar label="Rejected"
                                           count={totalRejected}
                                           total={totalApplied}
                                           color="var(--status-rejected)" />
                            </div>
                        </section>

                        <section className="analytics-section">
                            <h2 className="analytics-section-title">Conversion Rates</h2>
                            <div className="conversion-cards">
                                <div className="conversion-card glass-panel">
                                    <div className="conversion-value"
                                         style={{ color: 'var(--status-interview)' }}>{interviewRate}%
                                    </div>
                                    <div className="conversion-label">Applied → Interview</div>
                                    <div className="conversion-sub">{totalInterviews} of {totalApplied} applications</div>
                                </div>
                                <div className="conversion-arrow">→</div>
                                <div className="conversion-card glass-panel">
                                    <div className="conversion-value" style={{ color: 'var(--status-offer)' }}>
                                        {totalInterviews > 0 ? Math.round((totalOffers / totalInterviews) * 100) : 0}%
                                    </div>
                                    <div className="conversion-label">Interview → Offer</div>
                                    <div className="conversion-sub">{totalOffers} of {totalInterviews} interviews</div>
                                </div>
                                <div className="conversion-arrow">→</div>
                                <div className="conversion-card glass-panel">
                                    <div className="conversion-value"
                                         style={{ color: 'var(--accent-primary)' }}>{offerRate}%
                                    </div>
                                    <div className="conversion-label">Overall Offer Rate</div>
                                    <div className="conversion-sub">{totalOffers} of {totalApplied} applications</div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;
