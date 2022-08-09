import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "permissao",
})
export class PermissaoPipe implements PipeTransform {
  transform(value: boolean): string {
    if (value == true) {
      return "admin_panel_settings";
    } else {
      return "school";
    }
  }
}
