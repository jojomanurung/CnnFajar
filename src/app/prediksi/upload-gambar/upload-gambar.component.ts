import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as tf from '@tensorflow/tfjs';
import * as cv from '@techstark/opencv-js';

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

@Component({
  selector: 'app-upload-gambar',
  templateUrl: './upload-gambar.component.html',
  styleUrls: ['./upload-gambar.component.scss'],
})
export class UploadGambarComponent implements OnInit {
  @Input('editable') editable: boolean;
  @Output('payload') payload = new EventEmitter();
  @ViewChild('fileUpload') fileUpload: ElementRef;
  @ViewChild('image') img: ElementRef;
  @ViewChild('canvas1') canvas1: ElementRef;
  @ViewChild('canvas2') canvas2: ElementRef;
  form: FormGroup;
  naturalWidth: number;
  naturalHeight: number;
  isSubmit = false;
  classes = ['Benign', 'Malignant', 'Normal'];
  tooltip =
    'Kenapa harus pilih jenis gambar? Karna untuk confusion matrix kita membutuhkan true label dari setiap gambar yang akan di prediksi';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('step 1');
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      file_name: ['', Validators.required],
      file_src: ['', Validators.required],
      // class: ['', Validators.required],
    });
  }

  toBase64(file): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  async fileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      try {
        const image = await this.toBase64(file);
        this.form.get('file_src').patchValue(image);
        this.form.get('file_name').patchValue(file.name);
      } catch (error) {
        console.log(error);
      }
    }
  }

  upload(event: Event) {
    event.preventDefault();
    if (this.form.get('file_src').value) {
      this.reset();
    } else {
      this.fileUpload.nativeElement.click();
    }
  }

  reset() {
    this.form.get('file_name').setValue('');
    this.form.get('file_src').setValue('');
    this.fileUpload.nativeElement.value = null;
    this.isSubmit = false;
  }

  async processImg() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmit = true;

    // We need to wait element to finish rendering first
    // Due to ngIf dirrective
    await wait(10);

    this.naturalHeight = this.img.nativeElement.naturalHeight;
    this.naturalWidth = this.img.nativeElement.naturalWidth;

    const image = tf.tidy(() => {
      let img = this.img.nativeElement;
      img = tf.browser
        .fromPixels(img)
        .resizeBilinear([224, 224])
        .toFloat()
        .div(tf.scalar(255));
      return img;
    });
    await tf.browser.toPixels(image, this.canvas1.nativeElement);

    let img = cv.imread(this.canvas1.nativeElement);
    // let medianBlur = new cv.Mat();
    // cv.medianBlur(img, medianBlur, 5);
    // cv.imshow(this.canvas2.nativeElement, medianBlur);
    await wait(10);
    img.delete();
    // medianBlur.delete();
  }

  saveImg() {
    this.payload.emit(this.form.value);
    this.reset();
  }
}
