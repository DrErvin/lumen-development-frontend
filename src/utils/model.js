import { RES_PER_PAGE, EMPLOYEE_INFO } from "./config.js";
import { supabase } from "./helpers.js";
import { calculateRemainingDays } from "./helpers.js";

export const state = {
  opportunity: {},
  search: {
    query: {},
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  user: {},
  universityDomainsCache: [],
};

const createOpportunityObject = function (data) {
  const opportunity = data[0];
  return {
    id: opportunity.id || Date.now(),
    type: opportunity.type || "Unknown Type",
    fieldOfStudy: opportunity.field_of_study || "General",
    title: opportunity.title || "Untitled Opportunity",
    company: opportunity.company || "Company Name",
    location: opportunity.location || "Not specified",
    opportunityDescription: opportunity.description || "Description not available",
    yourProfile: opportunity.qualifications_and_requirements || [],
    tags: opportunity.tags || [],
    experience: opportunity.experience_required || [],
    engagementType: opportunity.engagement_type || "Unknown Engagement Type",
    workArrangement: opportunity.work_arrangement || "Unknown Work Arrangement",
    deadline: calculateRemainingDays(opportunity.ending_date) || "No deadline provided",
    benefits: opportunity.benefits || [],
    employeeInfo: opportunity.employee_info || EMPLOYEE_INFO,
    contactPerson: opportunity.contact_person || "Not specified",
    contactPersonEmail: opportunity.contact_person_email || "Not provided",
  };
};

const createUserObject = function (account) {
  return {
    id: account.id,
    accountType: account.id.startsWith("s-") ? "student" : "company",
    name_and_surname: account.name_and_surname || "",
  };
};

export const loadOpportunity = async function (id) {
  try {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    state.opportunity = createOpportunityObject([data]);
    console.log(state.opportunity);
  } catch (err) {
    console.error(`${err} 💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const { data, error } = await supabase.from("opportunities").select("*");

    if (error) throw new Error(error.message);

    const { location, titleOrKeyword, fieldOfStudy, type } = query;

    const results = data.filter((opportunity) => {
      return (
        (!location || opportunity.location.toLowerCase().includes(location.toLowerCase())) &&
        (!titleOrKeyword ||
          opportunity.title.toLowerCase().includes(titleOrKeyword.toLowerCase()) ||
          opportunity.tags.some((tag) => tag.toLowerCase().includes(titleOrKeyword.toLowerCase()))) &&
        (!fieldOfStudy || opportunity.field_of_study.toLowerCase().includes(fieldOfStudy.toLowerCase())) &&
        (!type || opportunity.type.toLowerCase().includes(type.toLowerCase()))
      );
    });

    state.search.results = results.map((opportunity) => ({
      id: opportunity.id,
      type: opportunity.type,
      location: opportunity.location,
      title: opportunity.title,
      experience: opportunity.experience_required,
      deadline: calculateRemainingDays(opportunity.ending_date),
    }));

    state.search.page = 1;
    console.log(state.search.results);
  } catch (err) {
    console.error(`${err} 💥`);
    throw err;
  }
};

export const initializeApp = async () => {
  try {
    // Clear user state
    clearState();

    // Fetch user details from Supabase
    await getUserDetails();
  } catch (err) {
    console.error("Error initializing app:", err);
  }
};

export const logoutUser = function () {
  try {
    // Clear user state
    clearState();

    console.log("User logged out successfully.");
  } catch (err) {
    console.error("Error logging out:", err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const uploadOpportunity = async function (newOpportunity) {
  try {
    const tags = newOpportunity.tags
      ? newOpportunity.tags.split(",").map((tag) => tag.trim())
      : [];
    const experienceRequired = newOpportunity.experienceRequired
      ? newOpportunity.experienceRequired.split(",").map((exp) => exp.trim())
      : [];
    const qualificationsAndRequirements =
      newOpportunity.qualificationsAndRequirements
        ? newOpportunity.qualificationsAndRequirements.split(";").map((req) => req.trim())
        : [];
    const benefits = newOpportunity.benefits
      ? newOpportunity.benefits.split(";").map((ben) => ben.trim())
      : [];

    const opportunity = {
      id: Date.now(),
      type: newOpportunity.type,
      field_of_study: newOpportunity.fieldOfStudy,
      title: newOpportunity.title,
      company: "Company Name",
      location: newOpportunity.location,
      description: newOpportunity.description,
      qualifications_and_requirements: qualificationsAndRequirements,
      benefits,
      tags,
      engagement_type: newOpportunity.engagementType,
      work_arrangement: newOpportunity.workArrangement,
      contact_person: newOpportunity.contactPerson,
      contact_person_email: newOpportunity.contactPersonEmail,
      experience_required: experienceRequired,
      ending_date: newOpportunity.endingDate,
    };

    const { data, error } = await supabase.from("opportunities").insert([opportunity]).select();

    if (error) throw new Error(error.message);

    state.opportunity = createOpportunityObject(data);
    console.log("Opportunity Uploaded:", state.opportunity);
  } catch (err) {
    console.error("Error with uploading opportunity:", err);
    throw err;
  }
};

export const verifyLogin = async function (data) {
  try {
    const { email, password } = data;

    // Query Supabase for the account matching the email and password
    const { data: accounts, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("email", email)
      .eq("password", password);

    if (error) throw new Error(error.message);

    // Find the first matching account
    const account = accounts?.[0];
    
    if (account) {
      state.user = createUserObject(account);
      saveUserToLocalStorage();
    }

    return account || null;
  } catch (err) {
    console.error("Error with verifying login:", err);
    throw err;
    
  }
}





export const isLoggedIn = function (requiredType = null) {
  const user = state.user;
  if (!user.id) return false;
  if (requiredType && user.accountType !== requiredType) {
    return false;
  }
  return true;
};

export const getUserDetails = async function () {
  try {
    if (!state.user.id) return null;

    // Query Supabase for the user's details
    const { data: accounts, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", state.user.id);

    if (error) throw new Error(error.message);

    const user = accounts?.[0];
    if (user) {
      state.user = createUserObject(user); // Update user state
    }

    return user || null;
  } catch (err) {
    console.error("Error fetching user details:", err);
    throw err;
  }
};
export const clearState = function () {
  state.user = {}; // Reset user state
  console.log("User state cleared.");
};


export const preloadUniversityDomains = async function () {
  try {
    const { data, error } = await supabase.from("world_universities_and_domains").select("*");

    if (error) throw new Error(error.message);

    state.universityDomainsCache = data.flatMap((uni) => uni.domains);
    console.log("University domains preloaded:", state.universityDomainsCache);
  } catch (err) {
    console.error("Error preloading university domains:", err);
    throw err;
  }
};

export const areUniversitiesCached = function () {
  return state.universityDomainsCache.length > 0;
};

export const validateEmail = async function (email) {
  try {
    if (!email.includes("@")) {
      console.log("Invalid email format: Missing @ symbol.");
      return false;
    }

    const emailDomain = email.split("@")[1];
    const domainParts = emailDomain.split(".");
    const isValidDomain = domainParts.some((_, index) => {
      const normalizedDomain = domainParts.slice(index).join(".");
      return (
        state.universityDomainsCache.includes(normalizedDomain) ||
        ["company.com"].includes(normalizedDomain)
      );
    });

    console.log(isValidDomain ? "Valid domain found" : "Invalid domain");
    return isValidDomain;
  } catch (err) {
    console.error("Error validating email:", err);
    throw err;
  }
};

export const generateUserInfo = async function (email) {
  try {
    const emailDomain = email.split("@")[1];
    const domainParts = emailDomain.split(".");
    const normalizedDomain = domainParts.slice(-2).join(".");
    const isCompanyDomain = normalizedDomain === "company.com";
    const idPrefix = isCompanyDomain ? "c-" : "s-";
    const account_type = isCompanyDomain ? "company" : "student";

    const userInfo = {
      id: `${idPrefix}${Date.now()}`,
      email,
      account_type,
      university_name: null,
      university_location: null,
    };

    if (isCompanyDomain) return userInfo;

    const { data, error } = await supabase.from("world_universities_and_domains").select("*");

    if (error) throw new Error(error.message);

    const university = data.find((uni) =>
      uni.domains.some((domain) => emailDomain.endsWith(domain))
    );

    if (!university) return userInfo;

    userInfo.university_name = university.name;
    userInfo.university_location = university.country;

    return userInfo;
  } catch (err) {
    console.error("Error generating user info:", err);
    throw err;
  }
};

export const uploadAccount = async function (newAccount) {
  try {
    const userInfo = await generateUserInfo(newAccount.email);

    const account = {
      ...userInfo,
      name_and_surname: newAccount.nameAndSurname,
      password: newAccount.password,
    };

    const { data, error } = await supabase.from("accounts").insert([account]).select();

    if (error) throw new Error(error.message);

    state.user = createUserObject(data[0]);
    console.log("User Added to Global State:", state.user);
    LocalStorage();
  } catch (err) {
    consaveUserTosole.error("Error uploading account:", err);
    throw err;
  }
};

export const submitApplication = async function (formData) {
  try {
    const userId = formData.get("userId");
    const opportunityId = formData.get("opportunityId");
    const file = formData.get("cvUpload");

    const application = {
      application_id: `${Date.now()}`,
      user_id: userId,
      opportunity_id: opportunityId,
      application_date: new Date().toISOString(),
    };

    const { error } = await supabase.from("applications").insert([application]);

    if (error) throw new Error(error.message);

    if (file) {
      // Handle file upload logic here (e.g., using a cloud storage service).
    }

    console.log("Application submitted successfully");
  } catch (err) {
    console.error("Error submitting application:", err);
    throw err;
  }
};

export const fetchFeatured = async function () {
  try {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("featured", true);

    if (error) throw new Error(error.message);

    console.log("Fetched Opportunities:", data);

    if (!data || data.length === 0) {
      console.warn("No opportunities found in the database.");
      return [];
    }

    return data;
  } catch (err) {
    console.error("Error fetching featured opportunities:", err);
    throw err;
  }
};

export const fetchAllOpportunities = async function () {
  try {
    const { data, error } = await supabase.from("opportunities").select("*");

    if (error) throw new Error(error.message);

    return data;
  } catch (err) {
    console.error("Error fetching opportunities:", err);
    throw err;
  }
};