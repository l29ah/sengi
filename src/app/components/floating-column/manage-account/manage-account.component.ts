import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { faAt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faBell, faEnvelope, faUser, faStar } from "@fortawesome/free-regular-svg-icons";

import { StreamElement, StreamTypeEnum, AddStream, RemoveAllStreams } from '../../../states/streams.state';
import { RemoveAccount } from '../../../states/accounts.state';
import { AccountWrapper } from '../../../models/account.models';
import { NavigationService } from '../../../services/navigation.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-manage-account',
    templateUrl: './manage-account.component.html',
    styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit {
    faAt = faAt;
    faBell = faBell;
    faEnvelope = faEnvelope;
    faUser = faUser;
    faStar = faStar;
    faUserPlus = faUserPlus;

    subPanel = 'account';
    hasNotifications = false;
    hasMentions = false;

    @Input() account: AccountWrapper;

    availableStreams: StreamElement[] = [];

    constructor(
        private readonly store: Store,
        private readonly navigationService: NavigationService,
        private notificationService: NotificationService) { }

    ngOnInit() {
        const instance = this.account.info.instance;
        this.availableStreams.length = 0;
        this.availableStreams.push(new StreamElement(StreamTypeEnum.global, 'Federated Timeline', this.account.info.id, null, null, instance));
        this.availableStreams.push(new StreamElement(StreamTypeEnum.local, 'Local Timeline', this.account.info.id, null, null, instance));
        this.availableStreams.push(new StreamElement(StreamTypeEnum.personnal, 'Home', this.account.info.id, null, null, instance));
    }

    addStream(stream: StreamElement): boolean {
        if (stream) {
            this.store.dispatch([new AddStream(stream)]).toPromise()
                .then(() => {
                    this.notificationService.notify(`stream added`, false);
                });
        }
        return false;
    }

    removeAccount(): boolean {
        const accountId = this.account.info.id;
        this.store.dispatch([new RemoveAllStreams(accountId), new RemoveAccount(accountId)]);
        this.navigationService.closePanel();
        return false;
    }

    loadSubPanel(subpanel: string): boolean {
        this.subPanel = subpanel;
        return false;
    }
}
