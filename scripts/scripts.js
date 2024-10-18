function onEntry(entry) {
    entry.forEach(change => {
      if (change.isIntersecting) {
        change.target.classList.add('element-show');
      }
    });
  }
    
  let options = {
      threshold: [0.5] };
  let observer = new IntersectionObserver(onEntry, options);
  let elements = document.querySelectorAll('.element-animation');
    
  for (let elm of elements) {
      observer.observe(elm);
  }
  
  //animated widget
  window.addEventListener('scroll', function() {
    var widgets = document.querySelectorAll('.animated-widget');
  
    widgets.forEach(function(widget) {
        var position = widget.getBoundingClientRect();
        var windowHeight = window.innerHeight;
  
        // Проверяем, виден ли виджет на странице
        if (position.top < windowHeight) {
            if (widget.classList.contains('from-bottom')) {
                widget.classList.add('show-bottom');
            } else if (widget.classList.contains('from-left')) {
                widget.classList.add('show-left');
            } else if (widget.classList.contains('from-right')) {
                widget.classList.add('show-right');
            }
        }
    });
  });
  
  // booking.js часть для переноса  данных для бронирования на часть с бронированием дата заезда выезда и количество человек
  $(document).ready(function () {
    const currentYear = new Date().getFullYear();
    const maxDate = new Date(currentYear, 12, 31);

    function getTomorrow() {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    }

    const today = new Date();
    const tomorrow = getTomorrow();
    const todayStr = today.toLocaleDateString('ru-RU');
    const tomorrowStr = tomorrow.toLocaleDateString('ru-RU');

    // Настройка календаря для выбора даты
    function getShowMonths() {
        return window.matchMedia('(max-width: 767px)').matches ? 1 : 2;
    }

    // Календарь для даты вылета
    const departureCalendar = flatpickr("#departureDate", {
        dateFormat: "d.m.Y",
        locale: "ru",
        minDate: "today",
        maxDate: maxDate,
        defaultDate: today,
        onClose: function (selectedDates) {
            if (selectedDates.length > 0) {
                const minReturnDate = new Date(selectedDates[0]);
                minReturnDate.setDate(minReturnDate.getDate() + 1);
                returnCalendar.set("minDate", minReturnDate);
                $("#returnDate").val(minReturnDate.toLocaleDateString('ru-RU'));
                returnCalendar.open(); // Автоматически открываем календарь даты возвращения
            }
        },
        showMonths: getShowMonths(),
    });

    // Календарь для даты возвращения
    const returnCalendar = flatpickr("#returnDate", {
        dateFormat: "d.m.Y",
        locale: "ru",
        minDate: tomorrow,
        maxDate: maxDate,
        defaultDate: tomorrow,
        showMonths: getShowMonths(),
    });

    // Обновление количества месяцев в календаре при изменении размера экрана
    window.addEventListener('resize', function () {
        const newShowMonths = getShowMonths();
        departureCalendar.set("showMonths", newShowMonths);
        returnCalendar.set("showMonths", newShowMonths);
    });

    // Открытие панели выбора гостей
    $("#guests").click(function (e) {
        e.preventDefault();
        var position = $(this).offset();
        $("#guestPicker").css({
            top: position.top + $(this).outerHeight(),
            left: position.left,
            display: "block",
        });
    });

    // Увеличение и уменьшение количества взрослых
    $("#increaseAdults").click(function () {
        let currentVal = parseInt($("#adultsInput").val());
        if (currentVal < 8) {
            $("#adultsInput").val(currentVal + 1);
            updateGuestsInput();
        }
    });

    $("#decreaseAdults").click(function () {
        let currentVal = parseInt($("#adultsInput").val());
        if (currentVal > 1) {
            $("#adultsInput").val(currentVal - 1);
            updateGuestsInput();
        }
    });

    // Закрытие панели выбора гостей
    $("#closeGuestPicker").click(function () {
        $("#guestPicker").hide();
    });

    // Обновление поля "Количество человек"
    function updateGuestsInput() {
        let adults = $("#adultsInput").val();
        $("#guests").val(adults + " взрослых");
    }

    updateGuestsInput(); // Первоначальное обновление значения

    // Скрытие выбора гостей при клике вне панели
    $(document).click(function (event) {
        if (!$(event.target).closest("#guestPicker, #guests").length) {
            $("#guestPicker").hide();
        }
    });

    // Обработка отправки формы
    $("#bookingForm").submit(function (e) {
        const departureDate = $("#departureDate").val() || new Date().toLocaleDateString('ru-RU');
        const returnDate = $("#returnDate").val() || getTomorrow().toLocaleDateString('ru-RU');
        const guests = $("#guests").val().split(' ')[0] || '2';

        $("#guests").val(guests); // Установить только число гостей
    });
});

  // Отключение вертикального положения на телефонах:
  // screen.orientation.lock('landscape');