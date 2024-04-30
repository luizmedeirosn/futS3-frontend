import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {ParameterDTO} from 'src/app/models/dto/parameter/response/ParameterDTO';
import {ParameterService} from 'src/app/services/parameter/parameter.service';
import {ChangesOnService} from 'src/app/shared/services/changes-on/changes-on.service';
import Page from "../../../../../models/dto/generics/response/Page";
import Pageable from "../../../../../models/dto/generics/request/Pageable";
import PageMin from "../../../../../models/dto/generics/response/PageMin";
import {TableLazyLoadEvent} from "primeng/table";

@Component({
    selector: 'app-delete-parameter-form',
    templateUrl: './delete-parameter-form.component.html',
    styleUrls: ['./delete-parameter-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeleteParameterFormComponent implements OnInit, OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public pageable!: Pageable;
    public loading$!: BehaviorSubject<boolean>;
    public page!: PageMin<ParameterDTO>;

    public constructor(
        private parameterService: ParameterService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private changesOnService: ChangesOnService,
    ) {
        this.pageable = new Pageable('', 0, 5);
        this.loading$ = new BehaviorSubject(false);
        this.page = {
            content: [],
            pageNumber: 0,
            pageSize: 5,
            totalElements: 0
        };
    }

    public ngOnInit(): void {
        this.page.totalElements === 0 && this.setParametersWithApi(this.pageable);
    }

    private setParametersWithApi(pageable: Pageable): void {
        this.pageable = pageable;

        this.loading$.next(true);

        setTimeout(() => {
            this.parameterService.findAll(pageable)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (parametersPage: Page<ParameterDTO>) => {
                        this.page.content = parametersPage.content;
                        this.page.pageNumber = parametersPage.pageable.pageNumber;
                        this.page.pageSize = parametersPage.pageable.pageSize;
                        this.page.totalElements = parametersPage.totalElements;

                        this.loading$.next(false);
                    },
                    error: (err) => {
                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to retrieve the data!',
                            life: this.toastLife
                        });

                        console.log(err);

                        this.loading$.next(false);
                    }
                });
        }, 500);
    }

    public handleChangePageAction($event: TableLazyLoadEvent) {
        if ($event && $event.first !== undefined && $event.rows) {
            const pageNumber = Math.ceil($event.first / $event.rows);
            const pageSize = $event.rows !== 0 ? $event.rows : 5;

            this.setParametersWithApi(new Pageable(this.pageable.keyword, pageNumber, pageSize));
        }
    }

    public handleDeleteParameterEvent($event: ParameterDTO): void {
        if ($event) {
            this.confirmationService.confirm({
                message: `Confirm the deletion of parameter: ${$event?.name}?`,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Yes',
                rejectLabel: 'No',
                acceptButtonStyleClass: 'p-button-danger',
                rejectButtonStyleClass: 'p-button-text',
                acceptIcon: "none",
                rejectIcon: "none",
                accept: () => this.handleDeleteParameterAction($event?.id)
            });
        }
    }

    public handleDeleteParameterAction(id: number): void {
        if (id) {
            this.messageService.clear();

            this.loading$.next(true);

            setTimeout(() => {
                this.parameterService.deleteById(id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.changesOnService.setChangesOn(true);

                            this.loading$.next(false);

                            this.setParametersWithApi(this.pageable);

                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Parameter deleted successfully!'
                            });
                        },
                        error: (err) => {
                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Unable to delete the parameter!'
                            });

                            console.log(err);

                            this.changesOnService.setChangesOn(false);

                            this.loading$.next(false);
                        }
                    });
            }, 500);
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
