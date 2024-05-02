import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {TableLazyLoadEvent} from 'primeng/table';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {ParameterRequestDTO} from 'src/app/models/dto/parameter/request/ParameterRequestDTO';
import {ParameterDTO} from 'src/app/models/dto/parameter/response/ParameterDTO';
import {ParameterService} from 'src/app/services/parameter/parameter.service';
import {ChangesOnService} from 'src/app/shared/services/changes-on/changes-on.service';
import Page from "../../../../../models/dto/generics/response/Page";
import Pageable from "../../../../../models/dto/generics/request/Pageable";
import PageMin from "../../../../../models/dto/generics/response/PageMin";

@Component({
    selector: 'app-edit-parameter-form',
    templateUrl: './edit-parameter-form.component.html',
    styleUrls: ['./edit-parameter-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditParameterFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public pageable!: Pageable;
    public loading$!: BehaviorSubject<boolean>;
    public page!: PageMin<ParameterDTO>;

    public viewTable$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    public selectedParameter!: ParameterDTO | undefined;

    public editParameterForm: any = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        description: ['', Validators.maxLength(2000)],
    });

    public constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,

        private parameterService: ParameterService,
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
            .pipe(takeUntil(this.$destroy))
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
    public handleChangePageAction(event$: TableLazyLoadEvent): void {
        if (event$ && event$.first !== undefined && event$.rows) {
            const pageNumber = Math.ceil(event$.first / event$.rows);
            const pageSize = event$.rows !== 0 ? event$.rows : 5;

            const pageable = new Pageable(this.pageable.keyword, pageNumber, pageSize);
            this.setParametersWithApi(pageable);
        }
    }

    public handleSelectParameter(id: number): void {
        if (id) {
            this.parameterService.findById(id)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (parameter: ParameterDTO) => {
                        if (parameter) {
                            this.selectedParameter = parameter;
                            this.editParameterForm.setValue({
                                name: parameter?.name,
                                description: parameter?.description,
                            });

                            this.viewTable$.next(false);
                        }
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
        }
    }

    public handleBackAction(): void {
        this.viewTable$.next(true);

        this.selectedParameter = undefined;

        // Update the table and detect the changes that occurred during editing
        this.changeDetectorRef.detectChanges();
    }

    public handleSubmitEditParameterForm(): void {
        if (this.editParameterForm.valid && this.editParameterForm.value) {
            const parameterResquest: ParameterRequestDTO = {
                name: this.editParameterForm.value.name as string,
                description: this.editParameterForm.value.description as string
            };

            this.selectedParameter &&
            this.parameterService.updateById(this.selectedParameter?.id, parameterResquest)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: () => {
                        this.editParameterForm.reset();

                        this.changesOnService.setChangesOn(true);

                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Parameter successfully registered!',
                            life: this.toastLife
                        });

                        this.handleBackAction();
                    },
                    error: (err) => {
                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Invalid registration!',
                            life: this.toastLife
                        });

                        console.log(err);

                        this.changesOnService.setChangesOn(false);
                    }
                });
        }
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
