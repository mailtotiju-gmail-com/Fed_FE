import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DecisionBaseComponent } from '../decision-base.component';
import { DecisionModel } from '../../../model/decision/decision.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
//// region CustomCodeBlockImport#

//// endregion CustomCodeBlockImport#

@Component({
  selector: 'app-decision-grid',
  templateUrl: './decision-grid.component.html',
  styleUrls: ['.././decision.component.css']
})

export class DecisionGridComponent extends DecisionBaseComponent implements OnInit, OnChanges {
    GridCheckAll = false;
    GridCheckAnItem = false;
    GridCheckItemCount = 0;
    @Input() notifyReloadRows: () => void;
    rows: DecisionModel[];
    constructor(private snackBar: MatSnackBar, protected http: HttpClient,
    //// region CustomCodeBlockConstructorItems#

    //// endregion CustomCodeBlockConstructorItems#
    ) {
        super(http);
        this.rows = [];
        this.service.get().subscribe((x) => {
                this.rows = x.body;
        });
    }
    ngOnInit() {
        /*if (this.rows.length === 0) {
            this.newBoxVisibility = true;
        }

        if (this.newBoxVisibility === true) {
            this.loadRelationalDropDowns();
        }
        */

        //// region CustomCodeBlockngOnInit#

        //// endregion CustomCodeBlockngOnInit#
    }
    ngOnChanges() {
        this.service.get().subscribe((x) => {
                this.rows = x.body;
        });
    }
    gridCheckAll() {
        this.GridCheckItemCount = 0;
        for (let i = 0; i < this.rows.length; i++) {
            this.rows[i].IsChecked = this.GridCheckAll;
            if (this.GridCheckAll) {
                this.GridCheckItemCount++;
            }
        }
        this.GridCheckAnItem = this.GridCheckAll;
    }
    checkAnItem() {
        this.GridCheckAnItem = false;
        let gridCheckAll = true;
        this.GridCheckItemCount = 0;
        for (let i = 0; i < this.rows.length; i++) {
            if (!this.rows[i].IsChecked) {
                gridCheckAll = false;
            } else {
                this.GridCheckItemCount++;
                this.GridCheckAnItem = true;
            }
        }
        this.GridCheckAll = gridCheckAll;
    }
    deleteSelectedItems() {
        this.GridCheckAnItem = false;
        this.GridCheckItemCount = 0;
        for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i].IsChecked) {
                const removeData = this.service.remove(this.rows[i].DecisionId);
            }
        }
         this.service.get().subscribe((x) => {
                this.rows = x.body;
        });
        this.snackBar.open('Deleted', ' ', this.snackBarConfig);
    }
    editrow(item: DecisionModel) {
        this.loadRelationalDropDowns();
        for (let i = 0; i < this.rows.length; i++) {
            this.rows[i].IsEdit = false;
            this.rows[i].IsChanged = false;
        }
        item.IsEdit = true;
    }
    cancelrow(item: DecisionModel) {
        item.IsEdit = false;
        item.IsChanged = false;
    }
    rowchanges(item: DecisionModel) {
        item.IsChanged = true;
    }
    deleterow(item: DecisionModel) {
      const removeData = this.service.remove(item.DecisionId);
      this.service.get().subscribe((x) => {
                this.rows = x.body;
        });
      this.snackBar.open('Deleted', ' ', this.snackBarConfig);
    }
    saverow(item: DecisionModel) {
        item.IsEdit = false;
        item.IsChanged = false;
        const savedData = this.service.set(item);
        this.service.get().subscribe((x) => {
                this.rows = x.body;
        });
        this.snackBar.open('Saved', ' ', this.snackBarConfig);
    }
    drop(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.rows, event.previousIndex, event.currentIndex);
                let orderIndex = 0;
                this.rows.forEach(
                            x => {
                              orderIndex++;
                              x.IsEdit = false;
                              x.IsChanged = false;
                              x.RowOrder = orderIndex;
                              this.service.set(x);
                              this.snackBar.open('Order Updated', ' ', this.snackBarConfig);
                });
    }
}
