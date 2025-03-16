function logout() {
    firebase.auth().signOut()
        .then(function () {
            // Sign-out successful.
            companyID = '';
            companyName = '';
            companyStand = '';
        })
        .catch(function (error) {
            // An error happened
        });
}