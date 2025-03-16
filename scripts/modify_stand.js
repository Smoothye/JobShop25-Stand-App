function selectStand(number) {
    if (companyID == '') {
        appendAlert("You are not connected!", "You must be connected in order to select a stand!", "danger");
        return;
    }
    if (companyStand != 0) {
        if (companyStand == number) {
            $('#deleteModal').modal('show');
            return;
        } else {
            appendAlert("You have already chosen a stand!", "If you want to choose another one, unselect your curent stand and then try again.", "danger");
            return;
        }
    }

    //Update databse company data
    firebase.database().ref('company/' + companyID).set({
        name: companyName,
        stand: number
    }).then(function () {
        //Update database stand info
        firebase.database().ref('stands/' + number).set({
            company: companyName,
        }).then(function () {
            var companyDetails = database.ref('company/' + companyID);
            companyDetails.once('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    companyName = data.name;
                    companyStand = data.stand;
                }
            }).then(function () {
                /* Retrieve stand info */
                var stands = database.ref('stands/');

                stands.once('value', (snapshot) => {
                    const data = snapshot.val();

                    standInfo = Object.values(data);
                    standKeys = Object.keys(data);
                }).then(
                    function () {
                        updateStands();
                    }
                ).catch((error) => {
                    appendAlert(error.code, error.message, "danger");
                });
            }).catch((error) => {
                appendAlert(error.code, error.message, "danger");
            });
        }).catch((error) => {
            appendAlert(error.code, error.message, "danger");
        });
    }).catch((error) => {
        appendAlert(error.code, error.message, "danger");
    });
}

function updateStands() {
    for (var i = 1; i <= nrStands; ++i) {
        var stand = document.getElementById("stand-" + i);
        var flippedStand = document.getElementById("flipped-stand-" + i);

        if (standKeys.includes(String(i))) {
            if (i == companyStand) {
                stand.classList.contains("occupied-stand") ? stand.classList.remove("ocuppied-stand") : null;
                stand.classList.add("selected-stand");

                flippedStand.classList.contains("occupied-stand") ? flippedStand.classList.remove("ocuppied-stand") : null;
                flippedStand.classList.add("selected-stand");

                console.log("Selected stand: " + i);
            } else {
                stand.classList.add("ocuppied-stand");
                stand.classList.contains("selected-stand") ? stand.classList.remove("selected-stand") : null;

                flippedStand.classList.add("ocuppied-stand");
                flippedStand.classList.contains("selected-stand") ? flippedStand.classList.remove("selected-stand") : null;
            }
            stand.innerHTML = standInfo[standKeys.indexOf(String(i))].company;
            flippedStand.innerHTML = standInfo[standKeys.indexOf(String(i))].company;
        } else {
            stand.classList.contains("occupied-stand") ? stand.classList.remove("occupied-stand") : null;
            stand.classList.contains("selected-stand") ? stand.classList.remove("selected-stand") : null;

            flippedStand.classList.contains("occupied-stand") ? flippedStand.classList.remove("occupied-stand") : null;
            flippedStand.classList.contains("selected-stand") ? flippedStand.classList.remove("selected-stand") : null;

            stand.innerHTML = "Stand " + i;
            flippedStand.innerHTML = "Stand " + i;
        }
    }
}


const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, description, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible m-3" role="alert">`,

        `<h4 class="alert-heading">Warning!</h4>`,
        `   <p>${message}</p>`,
        `<hr>`,
        `<p class="mb-0">${description}</p>`,
        `<button type="button" class="btn btn-close" data-bs-dismiss="alert"></button>`,
        `</div>`
    ].join('');

    alertPlaceholder.append(wrapper)
}

function unselectStand() {
    firebase.database().ref('stands/').child(companyStand).remove().then(function () {
        //Update database company data
        firebase.database().ref('company/' + companyID).set({
            name: companyName,
            stand: 0
        }).then(function () {
            /* Retrieve company details */
            var companyDetails = database.ref('company/' + companyID);
            companyDetails.once('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    companyName = data.name;
                    companyStand = data.stand;
                }
            }).then(function () {
                /* Retrieve stand info */
                var stands = database.ref('stands/');

                stands.once('value', (snapshot) => {
                    const data = snapshot.val();

                    if (data) {
                        standInfo = Object.values(data);
                        standKeys = Object.keys(data);
                    }
                }).then(
                    function () {
                        updateStands();
                        $('#deleteModal').modal('hide');
                        location.reload();
                    }
                ).catch((error) => {
                    appendAlert(error.code, error.message, "danger");
                });

            }).catch((error) => {
                appendAlert(error.code, error.message, "danger");
            });
        }).catch((error) => {
            appendAlert(error.code, error.message, "danger");
        });
    });

    
}