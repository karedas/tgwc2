import { MatPaginatorIntl } from '@angular/material/';

const italianRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length === 0 || pageSize === 0) { return `0 di ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} di ${length}`;
};


export class GetItalianPaginatorIntl extends MatPaginatorIntl {
  itemsPerPageLabel = 'Risultati per pagina:';
  nextPageLabel = 'Avanti';
  lastPageLabel = 'Ultima pagina';
  firstPageLabel = 'Prima pagina';
  previousPageLabel = 'Precedente';
  getRangeLabel = italianRangeLabel;
}
