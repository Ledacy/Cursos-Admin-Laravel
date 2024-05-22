import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss'],
})
export class UserAddComponent implements OnInit {
  @Output() UserC: EventEmitter<any>= new EventEmitter();
  name: any = null;
  surname: any = null;
  email: any = null;
  pasword: any = null;
  confirmation_password: any = null;
  image_previsualiza: any = './assets/media/avatars/300-6.jpg';
  file_avatar: any = null;
  isloading: any;
  constructor(public userservice: UserService, public toaster: Toaster, public modal: NgbActiveModal) {}
  ngOnInit(): void {
    this.isloading = this.userservice.isLoading$;
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
    if (!this.name || !this.surname || !this.email || !this.pasword || !this.confirmation_password) {
      this.toaster.open({
        text: 'Necesitas llenar todos los campos',
        caption: 'Validación',
        type: 'danger',
      });
      return;
    }
    if (this.pasword != this.confirmation_password) {
      this.toaster.open({
        text: 'Las contraseñas no son iguales',
        caption: 'Validación',
        type: 'danger',
      });
      return;
    }
    let formData = new FormData();
    formData.append('name', this.name);
    formData.append('surname', this.surname);
    formData.append('email', this.email);
    formData.append('password', this.pasword);
    formData.append('role_id', '1');
    formData.append('type_user', '2');
    formData.append('imagen', this.file_avatar);
    this.userservice.register(formData).subscribe((resp: any) => {
      console.log(resp);
      this.UserC.emit(resp.user);
      this.toaster.open({text: "El usuario se regitro correctamente", caption: "INFORME", type:'primary'})
      this.modal.close();
    });
  }
}
