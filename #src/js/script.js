"use strict";
$(document).ready(function() {
    //<Бургер с j-y>
    // $('.menu__icon').click(function(event) {
    //     $('.menu__icon,.menu__body').toggleClass('active');
    //     $('body').toggleClass('lock');
    // });
    //</Бургер с j-y>
    //<Бургер на нативном js>
    //<бургер header>//</бургер header>
    let menuBurger = document.querySelector('.menu__icon');
    let menuBody = document.querySelector('.menu__body');

    menuBurger.addEventListener('click', function(e) {
        menuBurger.classList.toggle('active');
        menuBody.classList.toggle('active');

    });
    //</бургер header>
    //<бургер submenu>

    let menuPageBurger = document.querySelector('.menu-page__burger');
    let menuPageBody = document.querySelector('.menu-page__body');

    menuPageBurger.addEventListener('click', function(e) {
        menuPageBurger.classList.toggle('active');
        menuPageBody.classList.toggle('active');

    });
    //</бургер submenu>
    //<.Бургер на нативном js>
    //<Выпадающий список поиска>
    let searchSelect = document.querySelector('.search-page__select');
    let categorysSearch = document.querySelector('.categorys-search');
    searchSelect.addEventListener('click', function(e) {
            categorysSearch.classList.toggle('active-search');
            //_slideToggle(categorysSearch);

        })
        //</Выпадающий список поиска>
        //<Выборка по списку поиска>
    let checkboxCategorys = document.querySelectorAll('.categorys-search__checkbox');

    for (let index = 0; index < checkboxCategorys.length; index++) {
        const checkboxCategory = checkboxCategorys[index];
        checkboxCategory.addEventListener('change', function(e) {
            checkboxCategory.classList.toggle('active');

            let checkboxActiveCategory = document.querySelectorAll('.categorys-search__checkbox.active')

            if (checkboxActiveCategory.length > 0) {
                searchSelect.classList.add('_categories');
                let searchQuantity = searchSelect.querySelector('.search-page__quantity');
                searchQuantity.innerHTML = searchQuantity.getAttribute('data-text') + ' ' + checkboxActiveCategory.length
            } else {
                searchSelect.classList.remove('_categories');

            }
        })
    }
    //</Выборка по списку поиска>



    //<выпвдвющее боковое меню>
    let menuParents = document.querySelectorAll('.menu-page__parent');

    for (let index = 0; index < menuParents.length; index++) {
        const menuParent = menuParents[index];
        menuParent.addEventListener('mouseenter', function(e) {
            menuParent.classList.add('_active');
        });
        menuParent.addEventListener('mouseleave', function(e) {
            menuParent.classList.remove('_active');
        })

    }

    //</выпвдвющее боковое меню>
});

//<Динамическая адаптация>
(function() {
    let originalPositions = [];
    let daElements = document.querySelectorAll('[data-da]');
    let daElementsArray = [];
    let daMatchMedia = [];
    //Заполняем массивы
    if (daElements.length > 0) {
        let number = 0;
        for (let index = 0; index < daElements.length; index++) {
            const daElement = daElements[index];
            const daMove = daElement.getAttribute('data-da');
            if (daMove != '') {
                const daArray = daMove.split(',');
                const daPlace = daArray[1] ? daArray[1].trim() : 'last';
                const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
                const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
                const daDestination = document.querySelector('.' + daArray[0].trim())
                if (daArray.length > 0 && daDestination) {
                    daElement.setAttribute('data-da-index', number);
                    //Заполняем массив первоначальных позиций
                    originalPositions[number] = {
                        "parent": daElement.parentNode,
                        "index": indexInParent(daElement)
                    };
                    //Заполняем массив элементов 
                    daElementsArray[number] = {
                        "element": daElement,
                        "destination": document.querySelector('.' + daArray[0].trim()),
                        "place": daPlace,
                        "breakpoint": daBreakpoint,
                        "type": daType
                    }
                    number++;
                }
            }
        }
        dynamicAdaptSort(daElementsArray);

        //Создаем события в точке брейкпоинта
        for (let index = 0; index < daElementsArray.length; index++) {
            const el = daElementsArray[index];
            const daBreakpoint = el.breakpoint;
            const daType = el.type;

            daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
            daMatchMedia[index].addListener(dynamicAdapt);
        }
    }
    //Основная функция
    function dynamicAdapt(e) {
        for (let index = 0; index < daElementsArray.length; index++) {
            const el = daElementsArray[index];
            const daElement = el.element;
            const daDestination = el.destination;
            const daPlace = el.place;
            const daBreakpoint = el.breakpoint;
            const daClassname = "_dynamic_adapt_" + daBreakpoint;

            if (daMatchMedia[index].matches) {
                //Перебрасываем элементы
                if (!daElement.classList.contains(daClassname)) {
                    let actualIndex = indexOfElements(daDestination)[daPlace];
                    if (daPlace === 'first') {
                        actualIndex = indexOfElements(daDestination)[0];
                    } else if (daPlace === 'last') {
                        actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
                    }
                    daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
                    daElement.classList.add(daClassname);
                }
            } else {
                //Возвращаем на место
                if (daElement.classList.contains(daClassname)) {
                    dynamicAdaptBack(daElement);
                    daElement.classList.remove(daClassname);
                }
            }
        }
        customAdapt();
    }

    //Вызов основной функции
    dynamicAdapt();

    //Функция возврата на место
    function dynamicAdaptBack(el) {
        const daIndex = el.getAttribute('data-da-index');
        const originalPlace = originalPositions[daIndex];
        const parentPlace = originalPlace['parent'];
        const indexPlace = originalPlace['index'];
        const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
        parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
    }
    //Функция получения индекса внутри родителя
    function indexInParent(el) {
        var children = Array.prototype.slice.call(el.parentNode.children);
        return children.indexOf(el);
    }
    //Функция получения массива индексов элементов внутри родителя 
    function indexOfElements(parent, back) {
        const children = parent.children;
        const childrenArray = [];
        for (let i = 0; i < children.length; i++) {
            const childrenElement = children[i];
            if (back) {
                childrenArray.push(i);
            } else {
                //Исключая перенесенный элемент
                if (childrenElement.getAttribute('data-da') == null) {
                    childrenArray.push(i);
                }
            }
        }
        return childrenArray;
    }
    //Сортировка объекта
    function dynamicAdaptSort(arr) {
        arr.sort(function(a, b) {
            if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
        });
        arr.sort(function(a, b) {
            if (a.place > b.place) { return 1 } else { return -1 }
        });
    }
    //Дополнительные сценарии адаптации
    function customAdapt() {
        //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }


}());
//</Динамическая адаптация>