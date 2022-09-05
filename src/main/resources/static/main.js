"use strict"

$( function() {
    let dialog,
        form,
        btnId, //clicked button id
        name = $("#name"),
        number = $("#number"),
        allFields = $( [] ).add(name).add(number),
        tips = $(".validateTips");


    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 450,
        width: 400,
        modal: true,
        buttons: {
            "Save": createContact,
            "Update": updateContact,
            Delete: deleteContact,
            Cancel: function() {
                dialog.dialog("close");
            }
        },
        close: function() {
            form[0].reset();
            allFields.removeClass("ui-state-error");
            tips.text("");
        }
    });

    form = dialog.find("form").on("submit", function(event) {
        event.preventDefault();
        updateContact();
    });

    /////Handlers/////

    $(":button.w3-button").button().on( "click", function() {
        btnId = this.id;
        dialog.dialog("open");
    });

    $(":button[id=createButton]").button().on( "click", function() {
        btnId = this.id;
        dialog.dialog("open");
    });

    $("#addSuffixForm").submit(function( event ) {
        event.preventDefault();
        addSuffixToName( $("#suffix").val() );
    });

    /////Handlers/////


    function updateTips(t) {
        tips.text(t)
            .addClass("ui-state-highlight");
        setTimeout(function() {
            tips.removeClass( "ui-state-highlight", 1500 );
        }, 500 );
    }

    function checkLength(o, n, min, max) {
        if ( o.val().length > max || o.val().length < min ) {
            o.addClass( "ui-state-error" );
            updateTips( "Length of " + n + " must be between " +
                min + " and " + max + "." );
            return false;
        } else {
            return true;
        }
    }

    //Return true if fields from dialog form pass the validation.
    function validation(){
        allFields.removeClass("ui-state-error");
        let valid = true;
        valid = valid && checkLength(name, "username", 1, 50);
        valid = valid && checkLength(number, "phone number", 11, 12);
        valid = valid && checkRegexp(name, /^[a-zа-я]([0-9a-zа-я_\s])*$/i,
            "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
        valid = valid && checkRegexp(number, /^[+]?[0-9]{11}$/, "Number format should be +79142062567 or 89142062567");
        return valid;
    }

    function checkRegexp(o, regexp, n) {
        if ( !( regexp.test( o.val() ) ) ) {
            o.addClass("ui-state-error");
            updateTips( n );
            return false;
        } else {
            return true;
        }
    }

    function updateContact() {
        if (btnId === "createButton") return ;

        let valid = validation();
        if (valid) {
            let payload = {
                name: name.val(),
                number: number.val()
            };

            $.ajax({
                url: "/contacts/" + btnId,
                method: "PATCH",
                data: payload,
                dataType: "json",
                success: function (data) {
                    let contact = data;
                    let updatedAt = contact.updatedAt.replace("T", " ").substring(0, 19); // Edit updatedAt date in java date format

                    $(":button[id=" + btnId + "]").text(contact.name + ", " + contact.phoneNumber + ", " + updatedAt);
                    console.log("SUCCESS : ", contact);
                },
                error: function (e) {
                    alert(e.responseText);
                    console.log("ERROR : ", e);
                }
            });

            dialog.dialog("close");
        }

        return valid;
    }

    function createContact() {
        if (btnId !== "createButton") return ;

        let valid = validation();
        if (valid) {
            let payload = {
                name: name.val(),
                number: number.val()
            };

            $.ajax({
                url: "/contacts",
                method: "POST",
                data: payload,
                dataType: "json",
                success: function (data) {
                    let contact = data;
                    let updatedAt = contact.updatedAt.replace("T", " ").substring(0, 19); // Edit updatedAt date in java date format

                    $("#contactsList").append(
                                        "<div class=\"w3-cursive\"> " +
                                            " <button class=\"w3-button ui-button ui-corner-all ui-widget\" id="+contact.id + ">" +
                                               contact.name + ", " + contact.phoneNumber + ", " + updatedAt +
                                            "</button>" +
                                            " <br> " +
                                        "</div>");

                    //Add click handler for new button
                    $(":button[id=" + contact.id + "]").button().on("click", function() {
                        btnId = this.id;
                        dialog.dialog("open");
                    });

                    console.log("SUCCESS : ", contact);
                },
                error: function (e) {
                    alert(e.responseText);
                    console.log("ERROR : ", e);
                }
            });

            dialog.buttonset().hide()
            dialog.dialog("close");
        }

        return valid;
    }

    function deleteContact(){
        if (btnId === "createButton") return ;

        $.ajax({
            url: "/contacts/" + btnId,
            method: "DELETE",
            dataType: "text",
            success: function (data) {
                $("div :button[id=" + btnId + "]").parent().remove();
                console.log("SUCCESS : ", data);
            },
            error: function (e) {
                alert(e.responseText);
                console.log("ERROR : ", e);
            }
        });

        dialog.dialog("close");
    }

    function addSuffixToName(suffix) {
        let payload = { suffix: suffix };
        $.ajax({
            url: "/contacts",
            method: "PATCH",
            data: payload,
            dataType: "text",
            success: function (data) {
                $(":button.w3-button").each(function() {
                    let beforeArray = $(this).text().split(', ');
                    beforeArray[0] = beforeArray[0] + suffix;
                    $(this).text(beforeArray.join(', '));
                });
                alert("Suffix \"" + suffix + "\" successfully added");
                console.log("SUCCESS: ", data);
            },
            error: function (e) {
                alert(e.responseText);
                console.log("ERROR : ", e);
            }
        });
    }
});
