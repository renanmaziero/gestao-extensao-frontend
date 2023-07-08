import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "permissao",
})
export class PermissaoPipe implements PipeTransform {
  transform(value: boolean): string {
    if (value == true) {
      return "verified_user";
    } else {
      return "school";
    }
  }
}
