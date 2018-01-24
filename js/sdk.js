/* Denne klasse står bl.a. for at forbinde klienten til serveren så systemet fungerer.
 * Den er udviklet med udgangspunkt i Jesper Bruun Hansen og Morten Dalgaard Laursens repo fra øvelsestimerne:
 * https://github.com/Distribuerede-Systemer-2017/javascript-client
*/

const SDK = {
  serverURL: "localhost:8080/api",
  request: (options, cb) => {

      let token = {
          "Authorization": SDK.Storage.load("token")
      };
    /* Her sætter jeg mit asynkrone kald til serveren op */
      $.ajax({
          url: SDK.serverURL + options.url,
          method: options.method,
          headers: token,
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify(SDK.Encryption.encrypt(JSON.stringify(options.data))),
          success: (data, status, xhr) => {
              cb(null, SDK.Encryption.decrypt(data), status, xhr);
          },
          error: (xhr, status, errorThrown) => {
              cb({xhr: xhr, status: status, error: errorThrown});
          }
      });

  },
  Student: {
      regStudent: (regStudentFirstName, regStudentLastName, regStudentEmail, regStudentPassword, verifyPassword, cb) => {
        SDK.request({
            data: {
                regStudentFirstName: regStudentFirstName,
                regStudentLastName: regStudentLastName,
                regStudentEmail: regStudentEmail,
                regStudentPassword: regStudentPassword,
                verifyPassword: verifyPassword
            },
            method: "POST",
            url: "/register",
        }, (err, data) => {
          if(err) return cb(err);
          cb(null, data);
        });

    },

      login: (studentemail, studentpassword, cb) => {
          SDK.request({
              data: {
                  studentemail: studentemail,
                  studentpassword: studentpassword
              },
              url: "/login",
              method: "POST"
          }, (err, data) => {

              if (err) return cb(err);

              SDK.Storage.persist("token", data);

              cb(null, data);
         });
    },

      logOut: (cb) => {
          SDK.request({
              method: "POST",
              url: "/students/logout",
          }, (err, data) => {
              if (err) {
                  return cb(err);
              }
              cb(null, data);
          });
      },

      current: (cb) => {
          SDK.request({
              url: "/students/profile",
              method: "GET"
          }, (err, data) => {

              if (err) return cb(err);

              localStorage.setItem("idStudent", JSON.parse(data).idStudent);

              cb(null, data);
          });
      },
      currentStudent: (cb) => {
          SDK.request({
              method: "GET",
              url: "/students/profile",
              headers: {authorization: SDK.Storage.load("token")}
          }, cb);
      },


      loadNav: (cb) => {
          $("#nav-container").load("nav.html", () => {
              const currentStudent = SDK.Student.currentStudent();
              if (currentStudent) {
                  $(".navbar-right").html(`
                    <li><a href="index.html">Hjem</a></li>
                    <li><a href="events.html">Events</a></li>
                    <li><a href="myEvents.html">Mine oprettede events </a></li>
                    <li><a href="createEvent.html">Lav event</a></li>
                    <li><a href="myAttendingEvents.html">Mine deltagende events</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
          `);
              } else {
                  $(".navbar-right").html(`
            <li><a href="login.html">Log ind <span class="sr-only">(currentStudent)</span></a></li>
            <li><a href="regStudent.html">Opret bruger</a></li>
          `);
              }
              $("#logout-link").click(() => {
                  SDK.Student.logOut((err, data) => {
                      if (err & err.xhr.status === 401) {
                          $(".form-group").addClass("has-error");
                      } else {
                          SDK.Storage.remove("token");
                          SDK.Storage.remove("student");
                          window.location.href = "index.html";
                      }
                  });

              });
              cb && cb();
          });
      }
  },
  Event: {
      createEvent: (regEventName, regDescription, regEventDate, regLocation, regPrice, cb) => {
          SDK.request({

              data: {
                  regEventName: regEventName,
                  regDescription: regDescription,
                  regEventDate: regEventDate,
                  regLocation: regLocation,
                  regPrice: regPrice
              },
              method: "POST",
              url: "/events"
          }, (err, data) => {
              if (err) return cb(err);

              cb(null, data);
          });
      },
    },

    getEvents: (cb, events) => {
        SDK.request({
            method: "GET",
            url: "/events",
            headers: {
                filter: {
                    include: ["events"]
                }
            }
        }, cb);
    },

    getAttStudents: (idEvent, cb) => {
        SDK.request({
            method: "GET",
            url: "/events/" + idEvent + "/students",
            headers: {
                Authorization: SDK.Storage.load("token")
            },
        }, cb);
    },

    getAttEvents: (cb) => {
        SDK.request({
            method: "GET",
            url: "/students/" + SDK.Storage.load("Student").idStudent + "/events",
            headers: {
                filter: {
                    include: ["events"]
                }
            }
        }, cb);
    },

    myEvents: (cb) => {
        SDK.request({
            method: "GET",
            url: "/events/myEvents",
            headers: {
                Authorization: SDK.Storage.load("token")
            },

        }, cb)
    },

    attendEvent: (regEventName, idEvent, regDescription, regEventDate, regLocation, regPrice, cb) => {
        SDK.request({
            data: {
                regEventName: regEventName,
                idEvent: idEvent,
                regDescription: regDescription,
                regEventDate: regEventDate,
                regLocation: regLocation,
                regPrice: regPrice,
            },
            method: "POST",
            url: "/events/join",
            authorization: SDK.Storage.load("token"),
        }, (err, data) => {
            if (err)
                return cb(err);
            cb(null, data);
        });
    },

    updateEvent: (idEvent, eventName, location, eventDate, price, description, cb) => {
        SDK.request({
            method: "PUT",
            url: "/events/" + idEvent + "/update-event",
            data: {
                eventName: eventName,
                description: description,
                eventDate: eventDate,
                location: location,
                price: price,
            }
        }, (err, data) => {
            if (err)
                return cb(err);

            SDK.Storage.persist("crypted", data);
            cb(null, data);
        });
    },

    current: () => {
        return SDK.Storage.load("Event");
    },

    deleteEvent: (idEvent, eventName, location, price, eventDate, description, cb) => {
        SDK.request({
            method: "PUT",
            url: "/events/" + idEvent + "/delete-event",
            data: {
                idEvent: idEvent,
                eventName: eventName,
                location: location,
                eventDate: eventDate,
                price: price,
                description: description,
            },
        }, cb);
    },

    Encryption: {
        encrypt: (encrypt) => {
            if (encrypt !== undefined && encrypt.length !== 0){
                const fields = ['J', 'M', 'F'];
                let encrypted = '';
                for (let i = 0; i <encrypt.length; i++) {
                    encrypted += (String.fromCharCode((encrypt.charAt(i)).charCodeAt(0) ^ (fields[i % fields.length]).charCodeAt(0)))
                }
                return encrypted;
            } else {
                return encrypt;
            }
        },

        decrypt:(decrypt) => {
            if (decrypt.length > 0 && decrypt !== undefined) {
                const fields = ['J', 'M', 'F'];
                let decrypted = '';
                for (let i = 0; i < decrypt.length; i++) {
                    decrypted += (String.fromCharCode((decrypt.charAt(i)).charCodeAt(0) ^ (fields[i % fields.length]).charCodeAt(0)))
                }
                return decrypted;
            } else {
                return decrypt;
            }

        }

    },

 /* Oprettet med hjælp fra Albert Molina Leon: https://github.com/MolinaLeon/D-Ksocial/blob/master/js/sdk.js
  * skulle meget gerne få min updateEvent til at virke
  */
    Url: {
        getParameterByName: (name) => {
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        }
    },

    Storage: {
        prefix: "DØKSocial",
        persist: (key, value) => {
            window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
        },
        load: (key) => {
            const val = window.localStorage.getItem(SDK.Storage.prefix + key);
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },
        remove: (key) => {
            window.localStorage.removeItem(SDK.Storage.prefix + key);
        }
    }
};