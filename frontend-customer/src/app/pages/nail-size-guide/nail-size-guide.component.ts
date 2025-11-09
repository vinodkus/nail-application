// nail-size-guide.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-nail-size-guide',
  template: `
    <div class="modal-content">
      <div class="modal-header bg-light">
        <h5 class="modal-title fw-bold text-primary">
          <i class="fas fa-ruler-combined me-2"></i>How to Check Your Nail Size
        </h5>
        <button type="button" class="btn-close" (click)="close()" aria-label="Close"></button>
      </div>
      <div class="modal-body p-4">
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="guide-step text-center">
              <img src="assets/images/nail-measure-1.jpg" 
                   class="img-fluid rounded mb-3" 
                   alt="Nail Measurement Step 1"
                   style="max-height: 300px; object-fit: cover; width: 100%;">
              <h6 class="fw-bold text-dark">Step 1: Measure Your Natural Nail</h6>
              <p class="text-muted small">
                Use a ruler to measure the width of your natural nail at its widest point in millimeters.
              </p>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="guide-step text-center">
              <img src="assets/images/nail-measure-2.jpg" 
                   class="img-fluid rounded mb-3" 
                   alt="Nail Measurement Step 2"
                   style="max-height: 300px; object-fit: cover; width: 100%;">
              <h6 class="fw-bold text-dark">Step 2: Compare with Size Chart</h6>
              <p class="text-muted small">
                Compare your measurement with our size chart to find your perfect fit.
              </p>
            </div>
          </div>
        </div>

        <!-- Size Chart -->
        <div class="size-chart mt-4">
          <h6 class="text-center mb-3 fw-bold text-dark">Nail Size Chart</h6>
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead class="table-light">
                <tr>
                  <th>Size</th>
                  <th>Width Range</th>
                  <th>Recommended For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="badge bg-primary">XS</span></td>
                  <td>10 - 12 mm</td>
                  <td>Small hands, pinky & ring fingers</td>
                </tr>
                <tr>
                  <td><span class="badge bg-success">S</span></td>
                  <td>13 - 15 mm</td>
                  <td>Average hands, middle & index fingers</td>
                </tr>
                <tr>
                  <td><span class="badge bg-warning text-dark">M</span></td>
                  <td>16 - 18 mm</td>
                  <td>Most common size, fits majority</td>
                </tr>
                <tr>
                  <td><span class="badge bg-danger">L</span></td>
                  <td>19 - 21 mm</td>
                  <td>Larger hands, thumb & wide nails</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="alert alert-info mt-3">
          <strong>Tip:</strong> If you're unsure, choose Medium (M) size as it fits most people. 
          You can also order multiple sizes for different fingers.
        </div>
      </div>
      <div class="modal-footer bg-light">
        <button type="button" class="btn btn-secondary" (click)="close()">Close</button>
        <button type="button" class="btn btn-primary" (click)="close()">
          Got it! Let me choose my size
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-content {
      border-radius: 10px;
      border: none;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .modal-header {
      border-bottom: 1px solid #dee2e6;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    
    .modal-footer {
      border-top: 1px solid #dee2e6;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
    
    .guide-step {
      padding: 1rem;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      transition: transform 0.2s ease;
    }
    
    .guide-step:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .table th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    
    .badge {
      font-size: 0.75rem;
      padding: 0.35em 0.65em;
    }
  `]
})
export class NailSizeGuideComponent {
  public baseUrl = environment.apiBaseUrl;

  constructor(
    private dialogRef: MatDialogRef<NailSizeGuideComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close() {
    this.dialogRef.close();
  }
}