import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      userIsAuthenticated: false,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      socialLogin: false,
      smsEnabled: false,
      emailEnabled: false,
      isAssignor: false,
      isAdmin: false,
      isReferee: false,
      courierId: null,
      userId: null
    }
  }),
  actions: {
    setFirstName(name) {
      this.user.firstName = name;
    },
    setLastName(name) {
      this.user.lastName = name;
    },
    setAuthenticated(authenticated) {
      this.user.userIsAuthenticated = authenticated;
    },
    setEmail(email){
      this.user.email = email;
    },
    setPhone(phone) {
      this.user.phone = phone;
    },
    setCourierId(courierId) {
      this.user.courierId = courierId;
    },
    setEmailEnabled(enable) {
      this.user.emailEnabled = enable;
    },
    setSMSEnabled(enable) {
      this.user.smsEnabled = enable;
    },
    setIsReferee(active) {
      this.user.isReferee = active;
    },
    setIsAssignor(active) {
      this.user.isAssignor = active;
    },
    setIsAdmin(active) {
      this.user.isAdmin = active;
    },
    setSocialLogin(active) {
      this.user.socialLogin = active;
    },
    setUserId(id) {
      this.user.userId = id;
    },
    setUser(user) {
      if (user) {
        this.user.firstName = user.value?.given_name ? user.value?.given_name : "";
        this.user.lastName = user.value?.family_name ? user.value?.family_name : "";
        this.user.email = user.value?.email ? user.value?.email : "";
        this.user.phone = user.value?.phone ? user.value?.phone : "";
        this.user.socialLogin = user.value?.sub.includes("oauth") ? true : false;
        this.user.userIsAuthenticated = user.value?.authenticated ? user.value?.authenticated : false;
        this.user.userId = user.value?.sub
        this.user.isAdmin = user.value?.user_roles.includes("admin") ? true : false;
        this.user.isReferee = user.value?.user_roles.includes("referee") ? true : false;
        this.user.isAssignor = user.value?.user_roles.includes("assignor") ? true : false;
      } else {
        this.user.firstName = "";
        this.user.lastName = "";
        this.user.email = "";
        this.user.phone = "";
        this.user.userId = null,
        this.user.emailEnabled = false;
        this.user.smsEnabled = false;
        this.user.isAssignor = false;
        this.user.isReferee = false;
        this.user.isAdmin = false;
        this.user.isSocialLogin = false;
        this.user.userIsAuthenticated = false;
      }
    }
  },
  getters: {
    firstName(state) {
      return state.user.firstName;
    },
    lastName(state) {
      return state.user.lastName;
    },
    userIsAuthenticated(state) {
      return state.user.userIsAuthenticated;
    },
    userId(state) {
      return state.user.userId
    },
    fullName(state) {
      if (state.user.lastName) {
        if (state.user.firstName) {
          return state.user.firstName + ' ' + state.user.lastName;
        }
        return state.user.lastName;
      }
      return (state.user.firstName ? state.user.firstName : null);
    },
    email(state) {
      return state.user.email;
    },
    phone(state) {
      return state.user.phone;
    },
    courierId(state) {
      return state.user.courierId;
    },
    emailEnabled(state) {
      return state.user.emailEnabled;
    },
    smsEnabled(state) {
      return state.user.smsEnabled;
    },
    isReferee(state) {
      return state.user.isReferee;
    },
    isAssignor(state) {
      return state.user.isAssignor;
    },
    isAdmin(state) {
      return state.user.isAdmin;
    },
    isSocialLogin(state) {
      return state.user.socialLogin;
    }
  }
});

export default useUserStore;
