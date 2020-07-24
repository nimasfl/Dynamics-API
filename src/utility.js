module.exports = {
  isJson: (string) => {
    try {
      JSON.parse(string);
      return true;
    } catch (err) {
      return false;
    }
  },

  createMessage(code) {
    switch (code) {
      case "ECONNREFUSED":
        return {
          fa: "پورت مورد نظر در حال سوریس دهی نمی باشد.",
          en: "Connection refused.",
        };
      case "www-authenticate":
        return {
          fa: "سرور مورد نظر قادر به اعتبارسنجی نمی باشد.",
          en: "Server could not authenticate.",
        };
      case "UNABLE_TO_VERIFY_LEAF_SIGNATURE":
        return {
          fa: "گواهی سرور مورد نظر معتبر نمی باشد.",
          en: "Server's certificate is not valid.",
        };
      case "ETIMEDOUT":
        return {
          fa: "زمان اتصال منقضی شد.",
          en: "Connection timed out.",
        };
      case "ENOTFOUND":
        return {
          fa: "آدرس سرور مورد نظر یافت نشد.",
          en: "Server address not found.",
        };
      case 200:
        return {
          fa: "درخواست شما با موفقیت اجرا گردید.",
          en: "Operation has been completed successfully.",
        };
      case 204:
        return {
          fa: "درخواست شما با موفقیت اجرا گردید.",
          en: "Operation has been completed successfully.",
        };
      case 400:
        return {
          fa: "اطاعات ارسالی به سرور مورد نظر معتیر نمی باشد.",
          en: "Invalid data has been sent to the server",
        };
      case 401:
        return {
          fa: "احراز هویت با خطا مواجه شد.",
          en: "Authentication failed.",
        };
      case 404:
        return {
          fa: "رکورد مورد نظر یافت نشد.",
          en: "Specified record not found.",
        };
      case 500:
        return {
          fa: "خطایی در داخل سرور رخ داده است.",
          en: "Internal server error occurred.",
        };
      default:
        return {
          fa: "خطای نامشخصی رخ داده است.",
          en: "Unexpected error occurred.",
        };
    }
  },
};
