import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatModule } from '../../appModules/mat.module';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [MatModule],
  
})
export class ContactComponent {
  contactForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      service: [''],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.loading = true;
      // Here you would typically send the form data to your backend
      console.log('Form data:', this.contactForm.value);
      
      // Simulate API call
      setTimeout(() => {
        this.loading = false;
        alert('Thank you for your message! We will get back to you soon.');
        this.contactForm.reset();
      }, 2000);
    }
  }
}