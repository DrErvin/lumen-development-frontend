import {
  RES_PER_PAGE,
  API_URL,
  EMPLOYEE_INFO,
  // UNIVERSITY_API_URL,
} from "./config.js";
import { AJAX, sendFormData } from "./helpers.js";
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
    id: opportunity.id,
    type: opportunity.type || "Unknown Type",
    fieldOfStudy: opportunity.fieldOfStudy || "General",
    title: opportunity.title || "Untitled Opportunity",
    company: opportunity.company || "Copmany Name",
    location: opportunity.location || "Not specified",
    opportunityDescription:
      opportunity.description || "Description not available",
    yourProfile: opportunity.qualificationsAndRequirements || [],
    tags: opportunity.tags || [],
    experience: opportunity.experienceRequired || [],
    engagementType:
      opportunity.engagementType || "Unknown Engagement Type",
    workArrangement:
      opportunity.workArrangement || "Unknown Work Arrangement",
    deadline:
      calculateRemainingDays(opportunity.endingDate) ||
      "No deadline provided",
    benefits: opportunity.benefits || [],
    employeeInfo: opportunity.employeeInfo || EMPLOYEE_INFO,
    contactPerson: opportunity.contactPerson || "Not specified",
    contactPersonEmail:
      opportunity.contactPersonEmail || "Not provided",
  };
};

const createUserObject = function (account) {
  return {
    id: account.id,
    accountType: account.id.startsWith("s-") ? "student" : "company",
    name_and_surname: account.name_and_surname || "",
    // id: user.id,
    // nameAndSurname: user.name_and_surname || '',
    // email: user.email || '',
    // password: user.password || '', // Avoid using plaintext passwords; ensure they're hashed in a real application
    // accountType: user.account_type || '',
    // universityName: user.university_name || '',
    // universityLocation: user.university_location || '',
  };
};

export const loadOpportunity = async function (id) {
  try {
    // const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    const data = await AJAX(`${API_URL}/opportunities`);
    console.log(data);
    // console.log(typeof id);

    // Find the opportunity with the specified ID
    const result = data.find(
      (opportunity) => +opportunity.id === +id
    );
    // console.log(result);
    if (!result)
      throw new Error(`Opportunity with ID ${id} not found`);

    state.opportunity = createOpportunityObject([result]);

    // Check if recipe that you click on has the same ID as the recipes
    // stored in the bookmark array in state
    // This way each recipe you open will always get a bookmakred
    // tag either true or false
    // if (state.bookmarks.some((bookmark) => bookmark.id === id))
    //   state.recipe.bookmarked = true;
    // else state.recipe.bookmarked = false;

    console.log(state.opportunity);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    // Save the query in the global state
    state.search.query = query;

    // Fetch the JSON data from the local file
    const data = await AJAX(`${API_URL}/opportunities`);
    // If was a real API, we would use something like this
    //  const data = await AJAX(`${API_URL}?${queryString}`);
    console.log("Check for data in loadSearchResults", data);

    // Filter the data based on the query parameters
    const { location, titleOrKeyword, fieldOfStudy, type } = query;
    const matchedResults = data.filter((opportunity) => {
      return (
        (!location ||
          opportunity.location
            .toLowerCase()
            .includes(location.toLowerCase())) &&
        (!titleOrKeyword ||
          opportunity.title
            .toLowerCase()
            .includes(titleOrKeyword.toLowerCase()) ||
          opportunity.tags.some((tag) =>
            tag.toLowerCase().includes(titleOrKeyword.toLowerCase())
          )) &&
        (!fieldOfStudy ||
          (opportunity.fieldOfStudy &&
            opportunity.fieldOfStudy
              .toLowerCase()
              .includes(fieldOfStudy.toLowerCase()))) &&
        (!type ||
          opportunity.type.toLowerCase().includes(type.toLowerCase()))
      );
    });

    // Map the filtered results to include only the required fields
    state.search.results = matchedResults.map((opportunity) => ({
      id: opportunity.id,
      type: opportunity.type,
      location: opportunity.location,
      title: opportunity.title,
      experience: opportunity.experienceRequired,
      deadline: calculateRemainingDays(opportunity.endingDate),
    }));

    // Reset the current page to the first page
    state.search.page = 1;

    console.log(state.search.results); // Debug: Check processed search results
  } catch (err) {
    console.error(`${err} 💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (
  page = state.search.page
) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const uploadOpportunity = async function (newOpportunity) {
  try {
    // Process tags field into an array
    const tags = newOpportunity.tags
      ? newOpportunity.tags.split(",").map((tag) => tag.trim())
      : [];

    // Process experienceRequired field into an array
    const experienceRequired = newOpportunity.experienceRequired
      ? newOpportunity.experienceRequired
          .split(",")
          .map((exp) => exp.trim())
      : [];

    // Process qualificationsAndRequirements into an array
    const qualificationsAndRequirements =
      newOpportunity.qualificationsAndRequirements
        ? newOpportunity.qualificationsAndRequirements
            .split(";")
            .map((req) => req.trim())
        : [];

    // Process benefits into an array
    const benefits = newOpportunity.benefits
      ? newOpportunity.benefits.split(";").map((ben) => ben.trim())
      : [];

    // Create opportunity object
    const opportunity = {
      id: Date.now(), // Timestamp-based numeric ID
      type: newOpportunity.type,
      fieldOfStudy: newOpportunity.fieldOfStudy,
      title: newOpportunity.title,
      company: "Company Name",
      location: newOpportunity.location,
      description: newOpportunity.description,
      qualificationsAndRequirements, // Processed field
      benefits, // Processed field
      tags,
      engagementType: newOpportunity.engagementType,
      workArrangement: newOpportunity.workArrangement,
      contactPerson: newOpportunity.contactPerson,
      contactPersonEmail: newOpportunity.contactPersonEmail,
      experienceRequired, // Processed field
      endingDate: newOpportunity.endingDate,
      employeeInfo: EMPLOYEE_INFO,
      featured: false,
    };

    // If real API was used we could now upload and get a response
    // const data = await AJAX(`${API_URL}?key=${KEY}`, opportunity);
    // state.opportunity = createOpportunityObject(data);

    // Send data to server
    const response = await AJAX(
      `${API_URL}/opportunities`,
      opportunity
    );
    console.log("Server Response:", response);

    // Add to global state
    state.opportunity = createOpportunityObject([
      response.newOpportunity,
    ]);
    // state.opportunity = createOpportunityObject(data);

    console.log("Opportunity Uploaded:", state.opportunity);
  } catch (err) {
    console.error("Error with uploading opportunity:", err);
    throw err;
  }
};

export const verifyLogin = async function (data) {
  try {
    // Fetch all accounts from the API
    const accounts = await AJAX(`${API_URL}/accounts`);

    // Find the account with matching email and password
    const account = accounts.find(
      (acc) =>
        acc.email === data.email && acc.password === data.password
    );

    // Update the state if the account is valid
    if (account) {
      state.user = createUserObject(account);

      saveUserToLocalStorage();
    }

    // Return the account if found, otherwise return null
    return account || null;
  } catch (err) {
    console.error("Error with verifiying login:", err);
    throw err;
  }
};

const saveUserToLocalStorage = function () {
  localStorage.setItem("loggedInUser", JSON.stringify(state.user));
};

export const loadUserFromLocalStorage = function () {
  const storedUser = localStorage.getItem("loggedInUser");
  if (!storedUser) return;

  const parsedUser = JSON.parse(storedUser);
  state.user.id = parsedUser.id;
  state.user.accountType = parsedUser.accountType;

  // if (storedUser) {
  //   const parsedUser = JSON.parse(storedUser);
  //   state.user.id = parsedUser.id;
  //   state.user.accountType = parsedUser.accountType;
  // }
};

export const isLoggedIn = function (requiredType = null) {
  const user = state.user;

  // Check if the user is logged in
  if (!user.id) return false;

  // If a specific account type is required, check against it
  if (requiredType && user.accountType !== requiredType) {
    return false;
  }

  // Return true if no specific account type is required, or if the type matches
  return true;
};

export const getUserDetails = async function () {
  try {
    // Ensure user ID is available in the global state
    if (!state.user.id) return null;

    // Fetch account data from the API
    const accounts = await AJAX(`${API_URL}/accounts`);

    // Find the user by ID
    const user = accounts.find((acc) => acc.id === state.user.id);
    return user || null;
  } catch (err) {
    console.error("Error fetching user details:", err);
    throw err;
  }
};

export const clearState = function () {
  try {
    // Clear user state
    // state.user.id = null;
    // state.user.accountType = null;
    state.user = {};

    console.log("User state cleared.");
  } catch (err) {
    console.error("Error clearing the global state:", err);
    throw err;
  }
};

export const clearLocalStorage = function () {
  try {
    // Clear local storage
    localStorage.removeItem("user");
    localStorage.removeItem("loggedInUser");

    console.log("Local storage cleared.");
  } catch (err) {
    console.error("Error clearing local storage:", err);
    throw err;
  }
};

// export const clearHistory = function () {
//   try {
//     // Clear browser history
//     window.history.pushState(null, '', '/');

//     console.log('Browser history cleared.');
//   } catch (err) {
//     console.error('Error clearing history:', err);
//     throw err;
//   }
// };

export const preloadUniversityDomains = async function () {
  try {
    // Local patch/fix for the universities.hipolabs API not working anymore
    const universities = await AJAX(`${API_URL}/world-universities`);

    // Cache all university domains
    state.universityDomainsCache = universities.flatMap(
      (uni) => uni.domains
    );
    console.log(
      "University domains preloaded:",
      state.universityDomainsCache
    );
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
    console.log("email to validate: ", email);

    // Ensure email contains an '@' before proceeding
    if (!email.includes("@")) {
      console.log("Invalid email format: Missing @ symbol.");
      return false;
    }

    // Extract the domain from the email
    const emailDomain = email.split("@")[1];

    // Normalize the domain by progressively removing subdomains
    const domainParts = emailDomain.split(".");

    // Check progressively from the full domain to subdomains
    const isValidDomain = domainParts.some((_, index) => {
      const normalizedDomain = domainParts.slice(index).join(".");
      return (
        state.universityDomainsCache.includes(normalizedDomain) ||
        ["company.com"].includes(normalizedDomain)
      );
    });

    console.log(
      isValidDomain ? "Valid domain found" : "Invalid domain"
    );
    return isValidDomain; // Return true if a valid domain is found
  } catch (err) {
    console.error("Error validating email:", err);
    throw err;
  }
};

export const generateUserInfo = async function (email) {
  try {
    // Extract the domain from the email
    const emailDomain = email.split("@")[1];

    // Normalize the domain by progressively removing subdomains
    const domainParts = emailDomain.split(".");
    const normalizedDomain = domainParts.slice(-2).join(".");

    // Determine if it's a Company or university domain
    const isCompanyDomain = normalizedDomain === "company.com";
    const idPrefix = isCompanyDomain ? "c-" : "s-";
    const account_type = isCompanyDomain ? "company" : "student";

    // Default user object
    const userInfo = {
      id: `${idPrefix}${Date.now()}`, // Unique ID
      email,
      account_type,
      university_name: null,
      university_location: null,
    };

    if (isCompanyDomain) return userInfo;

    // Fetch university details only if it's a university domain
    // if (!isCompanyDomain) {
    const universities = await AJAX(`${API_URL}/world-universities`);
    const university = universities.find((uni) =>
      uni.domains.some((domain) => emailDomain.endsWith(domain))
    );

    if (!university) return userInfo;
    // if (university) {
    userInfo.university_name = university.name;
    userInfo.university_location = university.country;
    // }
    // }

    return userInfo;
  } catch (err) {
    console.error("Error generating user info:", err);
    throw err;
  }
};

export const uploadAccount = async function (newAccount) {
  try {
    // Generate user info based on the email
    const userInfo = await generateUserInfo(newAccount.email);

    // Prepare account object
    const account = {
      ...userInfo, // Use generated user info
      name_and_surname: newAccount.nameAndSurname,
      password: newAccount.password,
    };

    // Upload to the API
    const response = await AJAX(`${API_URL}/accounts`, account);
    console.log("Account Uploaded:", response);

    // Add to global state
    state.user = createUserObject(response.data);
    console.log("User Added to Global State:", state.user);

    saveUserToLocalStorage();
  } catch (err) {
    console.error("Error uploading account:", err);
    throw err;
  }
};

export const submitApplication = async function (formData) {
  try {
    // console.log('Submitting application data:', formData);

    // Send FormData to the backend
    const response = await sendFormData(
      `${API_URL}/applications`,
      formData
    );

    console.log("Application submitted successfully:", response);
    return response;
  } catch (err) {
    console.error("Error submitting application:", err);
    throw err;
  }
};

export const fetchFeatured = async function () {
  try {
    // const res = await fetch(`${API_URL}/opportunities`);
    // if (!res.ok) throw new Error('Failed to fetch opportunities');
    // const data = await res.json();

    const data = await AJAX(`${API_URL}/opportunities`);

    // Filter opportunities to only include those that are featured
    const featuredOpportunities = data.filter(
      (opportunity) => opportunity.featured === true
    );
    return featuredOpportunities; // Return only featured opportunities
  } catch (err) {
    throw err;
  }
};

export const performSmartSearch = async function (query) {
  try {
    // Direct fetch without timeout for smart search
    // Using of native JS fetch instead of our custom AJAX function
    // due to current configuration of backend server, this is needed
    const res = await fetch(`${API_URL}/smart-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
    const results = await res.json();

    return results;
  } catch (err) {
    console.error("Error performing smart search:", err);
    throw err;
  }
};

export const fetchAllOpportunities = async function () {
  try {
    const opportunities = await AJAX(`${API_URL}/opportunities`);
    return opportunities;
  } catch (err) {
    console.error("Error fetching opportunities:", err);
    throw err;
  }
};

export const fetchAllApplications = async function () {
  try {
    const applications = await AJAX(`${API_URL}/applications`);
    return applications;
  } catch (err) {
    console.error("Error fetching applications:", err);
    throw err;
  }
};

export const fetchAllApplicantsData = async function () {
  try {
    // Fetch all applications and accounts
    const applications = await fetchAllApplications();
    const accounts = await AJAX(`${API_URL}/accounts`);

    // Match user IDs in applications to accounts
    const matchedAccounts = applications
      .map((app) => accounts.find((acc) => acc.id === app.user_id))
      .filter((account) => account !== undefined); // Filter out unmatched accounts

    return matchedAccounts; // Return an array of matched account objects
  } catch (err) {
    console.error("Error fetching applicants data:", err);
    throw err;
  }
};
