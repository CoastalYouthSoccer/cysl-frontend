import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      socialLogin: false,
      smsEnabled: false,
      emailEnabled: false,
      courierId: null,
      userId: null,
      userRoles: [],
      permissions: [],
      userAssociations: []
    }
  }),
  actions: {
    setUserRoles(roles) {
      this.user.userRoles = roles;
    },
    setPermissions(permissions) {
      this.user.permissions = permissions;
    },
    setUserAssociations(associations) {
      this.user.userAssociations = associations;
    },
    clearUser() {
      this.user = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        socialLogin: false,
        smsEnabled: false,
        emailEnabled: false,
        courierId: null,
        userId: null,
        userRoles: [],
        permissions: [],
        userAssociations: []
      }
    },
    setUser(user) {
      if (user) {
        this.user.firstName = user?.given_name ? user?.given_name : "";
        this.user.lastName = user?.family_name ? user?.family_name : "";
        this.user.email = user?.email ? user?.email : "";
        this.user.phone = user?.phone ? user?.phone : "";
        this.user.socialLogin = user?.sub.includes("oauth") ? true : false;
        this.user.userId = user?.sub
      } else {
        this.user.firstName = "";
        this.user.lastName = "";
        this.user.email = "";
        this.user.phone = "";
        this.user.userId = null;
        this.user.emailEnabled = false;
        this.user.smsEnabled = false;
      }
    }
  },
  getters: {
    firstName: (state) => state.user.firstName,
    lastName: (state) => state.user.lastName,
    isAuthenticated: (state) => !!state.user.email,
    userId: (state) => state.user.userId,

    fullName(state) {
      if (state.user.lastName) {
        if (state.user.firstName) {
          return state.user.firstName + ' ' + state.user.lastName;
        }
        return state.user.lastName;
      }
      return (state.user.firstName ? state.user.firstName : null);
    },
    email: (state) => state.user.email,
    phone: (state) => state.user.phone,
    courierId: (state) => state.user.courierId,
    emailEnabled: (state) => state.user.emailEnabled,
    smsEnabled: (state) => state.user.smsEnabled,
    userAssociations: (state) => state.user.userAssociations,
    isReferee: (state) => state.user?.userRoles?.includes('Referee') || false,
    isAssignor: (state) => state.user?.userRoles?.includes('Assignor') || false,
    isAdmin: (state) => state.user?.userRoles?.includes('Administrator') || false,
    isCoach: (state) => state.user?.userRoles?.includes('Coach') || false,
    isLeagueRep: (state) => state.user?.userRoles?.includes('League Rep') || false,
    isAssociationRep: (state) => state.user?.userRoles?.includes('Association Rep') || false,
    isSocialLogin: (state) => state.user.socialLogin
  }
});
