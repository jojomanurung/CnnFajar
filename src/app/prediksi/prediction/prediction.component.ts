import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as tf from '@tensorflow/tfjs';
import * as _ from 'lodash';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss'],
})
export class PredictionComponent implements OnInit, OnDestroy, AfterViewInit {
  _imageList: any[];
  @Input('data')
  set imageList(value) {
    this._imageList = value;
    if (!this.model) {
      this.loadModel();
    }
  }
  get imageList() {
    return this._imageList;
  }

  _hasilForm: any;
  @Input('hasil')
  set hasilForm(value) {
    this._hasilForm = value;
  }
  get hasilForm() {
    return this._hasilForm;
  }

  @Output('save') simpan: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  loading: boolean = false;
  loadingModel: boolean = true;
  model: tf.LayersModel;
  className = ['Benign', 'Malignant'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'name', 'benign', 'malignant'];
  private subs = new SubSink();
  page: number = 0;
  isDonePredict = false;

  constructor() {}

  ngOnInit(): void {
    console.log('step 3');
    this.setCurrentHasil();
  }

  setCurrentHasil() {
    if (this.hasilForm.is_saved === 'true') {
      this.dataSource.data = this.hasilForm.result;
      if (this.dataSource.paginator) {
        this.paginator.firstPage();
      } else {
        this.dataSource.paginator = this.paginator;
      }
      this.isDonePredict = true;
    } else {
      console.log('no data');
      return;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.subs.sink = this.paginator.page.subscribe((page) => {
      this.page = page.pageIndex * page.pageSize;
    });
  }

  async loadModel() {
    this.loadingModel = true;
    const baseUrl = location.origin;
    const modelUrl = baseUrl + '/assets/models/8_juli/model.json';
    console.log(modelUrl);
    this.model = await tf.loadLayersModel(modelUrl);
    // Warm up the model
    const result = this.model.predict(tf.zeros([1, 224, 224, 3])) as tf.Tensor;
    result.dataSync();
    result.dispose();
    this.loadingModel = false;
  }

  async startPredict() {
    const results: any[] = await Promise.all(
      this.imageList.map(async (img) => {
        const tensor = await this.tensorFactory(img);
        return tensor;
      })
    );
    console.log('results', results);

    this.loading = false;
    this.dataSource.data = _.cloneDeep(results);
    this.dataSource.paginator = this.paginator;
    if (this.dataSource.paginator) {
      this.paginator.firstPage();
    }
    this.isDonePredict = true;
  }

  async tensorFactory(input): Promise<any> {
    this.loading = true;
    let doc = await this.loadImage(input.file_src);
    const image = tf.tidy(() => {
      let img = doc;
      img = tf.browser
        .fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims(0);
      return img as tf.Tensor;
    });

    const result = this.model.predict(image) as tf.Tensor;
    const prediction = Array.from(result.argMax(-1).dataSync())[0];
    console.log('result', Array.from(result.argMax(-1).dataSync()));
    console.log('prediksi', prediction);
    const classes = Array.from(result.dataSync()).map((prob, indx) => {
      return {
        probability: prob,
        class: this.className[indx],
      };
    });

    const payload = this.createPayload(_.cloneDeep(input), prediction, classes);

    // console.log('name: ', input.file_name);
    // console.log('prediction', prediction);
    // console.log('payload', payload);

    result.dispose();
    return payload;
  }

  createPayload(payload, prediction, classes) {
    payload.prediction = prediction;
    payload.benign = classes.find((val) => val.class === 'Benign').probability;
    payload.malignant = classes.find(
      (val) => val.class === 'Malignant'
    ).probability;

    return payload;
  }

  loadImage(url): Promise<any> {
    return new Promise((resolve, reject) => {
      const im = new Image();
      im.crossOrigin = 'anonymous';
      im.src = url;
      im.onload = () => {
        resolve(im);
      };
      im.onerror = (error) => {
        reject(error);
      };
    });
  }

  saveResult() {
    this.simpan.emit(this.dataSource.data);
  }

  ngOnDestroy(): void {
    this.model.dispose();
    this.subs.unsubscribe();
  }
}
