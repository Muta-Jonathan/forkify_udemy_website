import View from "./View";
import icons from "url:../../img/icons.svg";
import { PREV,NEXT,LEFT,RIGHT } from "../config";

class PaginationView extends View {
    _parentElement = document.querySelector(".pagination");
    
    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;

            const goToPage = +btn.dataset.goto;

            handler(goToPage);
        });
    }

    _generateMarkup() {
        const currentPage = this._data.page;
        const numPages = Math.ceil(
            this._data.results.length / this._data.resultsPerPage
            );
            
            // on Page 1, there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupBtn((currentPage + 1), NEXT, RIGHT);
        
    }

    // on last page
    if (currentPage === numPages && numPages > 1) {
        return this._generateMarkupBtn((currentPage - 1), PREV, LEFT);
    }

    // on other pages
    if (currentPage < numPages) {
      return `
      ${this._generateMarkupBtn((currentPage - 1), PREV, LEFT)}
      ${this._generateMarkupBtn((currentPage + 1), NEXT, RIGHT)}
      `;
    }
    
    // on Page 1, no other pages
    return "";
  }

  _generateMarkupBtn(pageNumber, btnArrow, iconArrow) {
    return `
        <button data-goto ="${pageNumber}" class="btn--inline pagination__btn--${btnArrow}">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-${iconArrow}"></use>
            </svg>
            <span>Page ${pageNumber}</span>
        </button>
        `;
  }
}


export default new PaginationView();