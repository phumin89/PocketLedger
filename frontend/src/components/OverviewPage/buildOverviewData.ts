import type { ICurrentUserResponse } from '@pocketledger/contracts';
import type { OverviewData } from '../../content/OverviewData';

export function buildOverviewData(
    baseData: OverviewData,
    currentUser: ICurrentUserResponse | null,
    currentUserError: string | null,
    isCurrentUserLoading: boolean
): OverviewData {
    if (currentUser) {
        return {
            ...baseData,
            subtitle:
                'Your profile is loading from the Pocket ledger API now. The summary cards are still using sample numbers for this pass.',
            profile: {
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                occupation: currentUser.email,
                status: 'Live profile',
            },
            highlights: [
                {
                    label: 'Full name',
                    value: `${currentUser.firstName} ${currentUser.lastName}`,
                },
                {
                    label: 'Email',
                    value: currentUser.email,
                },
                {
                    label: 'Locale · Time zone',
                    value: `${currentUser.locale} · ${currentUser.timeZone}`,
                },
                {
                    label: 'Currency',
                    value: currentUser.currencyCode,
                },
            ],
        };
    }

    if (isCurrentUserLoading) {
        return {
            ...baseData,
            subtitle:
                'Pulling in your profile now. The rest of the dashboard is still showing sample numbers for the moment.',
            profile: {
                ...baseData.profile,
                status: 'Syncing profile',
            },
        };
    }

    if (currentUserError) {
        return {
            ...baseData,
            subtitle:
                'We could not load your live profile right now, so you are seeing the sample profile instead.',
            profile: {
                ...baseData.profile,
                status: 'Sample profile',
            },
        };
    }

    return baseData;
}
