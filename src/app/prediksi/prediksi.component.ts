import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatHorizontalStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-prediksi',
  templateUrl: './prediksi.component.html',
  styleUrls: ['./prediksi.component.scss'],
})
export class PrediksiComponent implements OnInit {
  @ViewChild('stepper') stepper: MatHorizontalStepper;
  selectedIndex: number = 0;
  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  fourthForm: FormGroup;
  isEditable: boolean = true;
  imageDataList: any[] = [];

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.firstForm = this.fb.group({
      done: ['', Validators.required],
    });

    this.secondForm = this.fb.group({
      done: ['', Validators.required],
    });

    this.thirdForm = this.fb.group({
      result: this.fb.array([]),
      is_saved: ['', Validators.required],
      convusion_matrix: [null],
    });

    this.fourthForm = this.fb.group({
      done: ['', Validators.required],
    });
  }

  initResultForm() {
    return this.fb.group({
      file_src: [''],
      file_name: [''],
      prediction: [''],
      benign: [''],
      malignant: [''],
      normal: [''],
    });
  }

  getResultArray() {
    return this.thirdForm.get('result') as FormArray;
  }

  selectionChange(event: StepperSelectionEvent): void {
    const currentIndex = event.selectedIndex;
    const prevIndex = event.previouslySelectedIndex;

    // To set previous step state to nothing
    if (prevIndex > currentIndex) {
      event.previouslySelectedStep.state = '';
    }
    this.selectedIndex = currentIndex;
  }

  saveImage(event: any) {
    this.imageDataList.push(event);
    this.firstForm.get('done').patchValue('true');
    const message =
      'Sukses menambahkan ' + event.file_name + ' ke dalam list data';
    this._snackBar.open(message, null, {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
    console.log('data img', this.imageDataList);
  }

  proceed() {
    this.secondForm.get('done').patchValue('true');
    this.isEditable = false;
    this.stepper.next();
  }

  predictionResult(data) {
    console.log('hasil', data);
    if (data && data.length) {
      data.forEach((element) => {
        if (this.getResultArray().controls.length < data.length) {
          this.getResultArray().push(this.initResultForm());
        }
      });

      this.getResultArray().patchValue(data);
      this.thirdForm.controls['is_saved'].patchValue('true');
      this.stepper.next();
      console.log('result array', this.thirdForm.value);
    }
  }

  reset(event) {
    if (event) {
      this.isEditable = true;
      this.imageDataList = [];
      this.firstForm.reset();
      this.secondForm.reset();
      this.thirdForm.reset();
      this.fourthForm.reset();
      this.stepper.reset();
    }
  }
}
