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
                'Live user profile synced from the PocketLedger API. Summary cards remain mock-driven for now.',
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
                'Loading the current user profile from the API. Financial summary cards are still mock-driven.',
            profile: {
                ...baseData.profile,
                status: 'Syncing profile',
            },
        };
    }

    if (currentUserError) {
        return {
            ...baseData,
            subtitle: currentUserError,
            profile: {
                ...baseData.profile,
                status: 'Fallback profile',
            },
        };
    }

    return baseData;
}
