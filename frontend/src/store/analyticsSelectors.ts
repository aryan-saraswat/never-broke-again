import { BoardStore } from './useBoardStore';

export const selectFunnelStats = (state: BoardStore) => {
    const jobs = Object.values(state.jobs);
    const totalApplied = jobs.filter(j => j.status !== 'wishlist').length;
    const totalInterviews = jobs.filter(j => j.status === 'interview' || j.status === 'offer').length;
    const totalOffers = jobs.filter(j => j.status === 'offer').length;
    const totalRejected = jobs.filter(j => j.status === 'rejected').length;
    const totalWishlist = jobs.filter(j => j.status === 'wishlist').length;

    const responseRate = totalApplied > 0 ? Math.round(
        (totalInterviews + totalOffers + totalRejected) / totalApplied * 100) : 0;
    const interviewRate = totalApplied > 0 ? Math.round((totalInterviews + totalOffers) / totalApplied * 100) : 0;
    const offerRate = totalApplied > 0 ? Math.round(totalOffers / totalApplied * 100) : 0;

    return {
        totalApplied,
        totalInterviews,
        totalOffers,
        totalRejected,
        totalWishlist,
        responseRate,
        interviewRate,
        offerRate,
    };
};
