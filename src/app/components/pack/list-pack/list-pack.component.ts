import { Component } from '@angular/core';
import { PackService } from '../../../services/pack/pack.service';
import { ToastrService } from 'ngx-toastr';
import { Pack } from '../../../models/pack/pack';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-pack',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './list-pack.component.html',
  styleUrl: './list-pack.component.css'
})
export class ListPackComponent {

  packs: Pack[] = [];

  constructor(private packService: PackService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadPacks();
  }

  loadPacks() {
    this.packService.getPacks().subscribe({
      next: (data) => this.packs = data,
      error: (err) => console.error(err)
    });
  }

  deletePack(id: number) {
    if (!confirm('Supprimer ce pack ?')) return;
    this.packService.deletePack(id).subscribe({
      next: () => {
        this.toastr.success('Pack supprimé');
        this.loadPacks();
      },
      error: (err) => console.error(err)
    });
  }
}
