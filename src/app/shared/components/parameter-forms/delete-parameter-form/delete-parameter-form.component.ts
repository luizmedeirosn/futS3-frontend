import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';
import { PlayerMinDTO } from 'src/app/models/dto/player/response/PlayerMinDTO';
import { ParameterService } from 'src/app/services/parameter/parameter.service';

@Component({
    selector: 'app-delete-parameter-form',
    templateUrl: './delete-parameter-form.component.html',
    styleUrls: ['./delete-parameter-form.component.scss']
})
export class DeleteParameterFormComponent {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    private parametersTablePages: Array<Array<ParameterDTO>> = new Array();

    public $loadingDeletion: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public parameters!: ParameterDTO[];
    public selectedParameter!: ParameterDTO | undefined;

    public constructor(
        private parameterService: ParameterService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) { }

    public ngOnInit(): void {
        this.setParametersWithApi();
    }

    private setParametersWithApi(): void {
        this.parameterService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (parameters) => {
                    this.parameters = parameters;

                    let increment: number = 0;
                    let page: Array<ParameterDTO> = new Array();

                    parameters.forEach((parameter, index, array) => {
                        page.push(parameter);
                        increment += 1;
                        if (increment === 5 || index === array.length - 1) {
                            this.parametersTablePages.push(page);
                            page = new Array();
                            increment = 0;
                        }
                    });
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
                }
            });
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    public handleDeleteParameterEvent(event: PlayerMinDTO): void {
        if (event) {
            this.confirmationService.confirm({
                message: `Confirm the deletion of player: ${event?.name}?`,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Yes',
                rejectLabel: 'No',
                acceptButtonStyleClass: 'p-button-danger',
                rejectButtonStyleClass: 'p-button-text',
                acceptIcon: "none",
                rejectIcon: "none",
                accept: () => this.handleDeleteParameterAction(event?.id)
            });
        }
    }

    public handleDeleteParameterAction($event: number): void {
        if ($event) {
            this.$loadingDeletion.next(true);
            this.messageService.clear();

            this.parameterService.deleteById($event)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: () => {
                        setTimeout(() => {
                            this.$loadingDeletion.next(false);
                            this.setParametersWithApi();

                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Player deleted successfully!'
                            });
                            this.parameterService.setChangesOn(true);
                        }, 1000);
                    },
                    error: (err) => {
                        console.log(err);
                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Unable to delete the player!'
                        });
                        this.parameterService.setChangesOn(false);
                    }
                });
        }

    }

}
