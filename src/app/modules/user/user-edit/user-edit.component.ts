import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../service/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  @Input() user: any;
  @Output() UserE: EventEmitter<any> = new EventEmitter();
  name: any = null;
  surname: any = null;
  email: any = null;
  state: any = 1;
  is_instructor: any = null;
  profesion: any = null;
  description: any = null;
  password: any = null;
  confirmation_password: any = null;
  image_previsualiza: any = './assets/media/avatars/300-6.jpg';
  file_avatar: any = null;
  isloading: any;

  constructor(public userservice: UserService, public toaster: Toaster, public modal: NgbActiveModal) { }
  ngOnInit(): void {
    this.isloading = this.userservice.isLoading$;
    this.name = this.user.name;
    this.surname = this.user.surname;
    this.email = this.user.email;
    this.state = this.user.state;
    this.image_previsualiza = this.user.avatar;
    this.is_instructor = this.user.is_instructor;
    this.profesion = this.user.profesion;
    this.description = this.user.description;
  }

  processAvatar($event: any) {
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toaster.open({
        text: 'SOLAMENTE SE ACEPTAN IMAGENES',
        caption: 'MENSAJE DE VALIDACIÓN',
        type: 'danger',
      });
      return;
    }
    this.file_avatar = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_avatar);
    reader.onload = () => (this.image_previsualiza = reader.result);
  }
  store() {
    if (!this.name || !this.surname || !this.email) {
      this.toaster.open({
        text: 'Necesitas llenar todos los campos',
        caption: 'Validación',
        type: 'danger',
      });
      return;
    }
    if (this.password) {
      if (this.password != this.confirmation_password) {
        this.toaster.open({
          text: 'Las contraseñas no son iguales',
          caption: 'Validación',
          type: 'danger',
        });
        return;
      }
    }
    let formData = new FormData();
    formData.append('name', this.name);
    formData.append('surname', this.surname);
    formData.append('email', this.email);
    formData.append('state', this.state);
    formData.append('password', this.password);
    if (this.is_instructor) {
      formData.append('is_instructor', this.is_instructor ? "1" : "0");
      formData.append('profesion', this.profesion);
      formData.append('description', this.description);
    }
    if (this.file_avatar) {
      formData.append('imagen', this.file_avatar);
    }
    this.userservice.update(formData, this.user.id).subscribe((resp: any) => {
      console.log(resp);
      this.UserE.emit(resp.user);
      this.toaster.open({ text: "El usuario se actualizo correctamente", caption: "INFORME", type: 'primary' })
      this.modal.close();
    });
  }
  isInstructor() {
    this.is_instructor = !this.is_instructor;
  }
}
