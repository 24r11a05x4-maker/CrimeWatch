import { LanguageCode } from '../types';

export interface Translations {
  appName: string;
  nav: {
    home: string;
    reportCrime: string;
    trackReport: string;
    crimeMap: string;
    login: string;
    register: string;
    dashboard: string;
    logout: string;
    myReports: string;
    overview: string;
    profile: string;
    cases: string;
    analytics: string;
    users: string;
    reports: string;
    securityAudit: string;
    statistics: string;
  };
  hero: {
    heading: string;
    subheading: string;
    reportButton: string;
    trackButton: string;
    mapButton: string;
    emergencyNotice: string;
    emergencyCall: string;
  };
  features: {
    secureTitle: string;
    secureDesc: string;
    anonymousTitle: string;
    anonymousDesc: string;
    aiTitle: string;
    aiDesc: string;
    trackingTitle: string;
    trackingDesc: string;
    mapTitle: string;
    mapDesc: string;
    safetyTitle: string;
    safetyDesc: string;
  };
  common: {
    status: string;
    category: string;
    date: string;
    time: string;
    location: string;
    priority: string;
    referenceId: string;
    actions: string;
    submit: string;
    cancel: string;
    back: string;
    next: string;
    viewDetails: string;
    save: string;
    filter: string;
    search: string;
    loading: string;
    noData: string;
    anonymous: string;
    verifiedCitizen: string;
    humanReviewRecommended: string;
    safetyNoticeTitle: string;
  };
  statusLabels: {
    Submitted: string;
    'Under Review': string;
    Assigned: string;
    'Investigation in Progress': string;
    Resolved: string;
  };
  categories: {
    Theft: string;
    'Vehicle Theft': string;
    Assault: string;
    Burglary: string;
    Vandalism: string;
    Fraud: string;
    'Cyber Crime': string;
    Harassment: string;
    Other: string;
  };
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    appName: 'Crime Watch',
    nav: {
      home: 'Home',
      reportCrime: 'Report Crime',
      trackReport: 'Track Report',
      crimeMap: 'Crime Map',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      logout: 'Logout',
      myReports: 'My Reports',
      overview: 'Overview',
      profile: 'Profile',
      cases: 'Cases',
      analytics: 'Analytics',
      users: 'User Management',
      reports: 'All Reports',
      securityAudit: 'Security / Audit',
      statistics: 'System Statistics',
    },
    hero: {
      heading: 'Safer Communities Through Smarter Reporting',
      subheading:
        'A secure, community-driven reporting platform equipped with AI-assisted categorization, transparent citizen status tracking, and authorized police case workflows.',
      reportButton: 'Report a Crime',
      trackButton: 'Track a Report',
      mapButton: 'View Crime Map',
      emergencyNotice:
        'Safety Notice: Crime Watch is a reporting and community information system and does not replace emergency response. If you or someone else is in immediate danger, dial 112 / 100 immediately.',
      emergencyCall: 'Emergency Helpline: 112 / 100',
    },
    features: {
      secureTitle: 'Secure Crime Reporting',
      secureDesc: 'Submit encrypted crime reports directly to authorized law enforcement officers.',
      anonymousTitle: 'Anonymous Reporting',
      anonymousDesc: 'Confidential reporting with full privacy guarantees. Identity is never shared.',
      aiTitle: 'AI-Assisted Analysis',
      aiDesc: 'Automated initial classification assists law enforcement with intelligent incident assessment.',
      trackingTitle: 'Case Tracking',
      trackingDesc: 'Track your report timeline in real time from submission through resolution with reference IDs.',
      mapTitle: 'Crime Map',
      mapDesc: 'Explore public crime distribution while protecting private reporter confidentiality.',
      safetyTitle: 'Community Safety',
      safetyDesc: 'Aggregated analytics and transparent data help neighborhoods stay informed and vigilant.',
    },
    common: {
      status: 'Status',
      category: 'Crime Category',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      priority: 'Priority',
      referenceId: 'Reference ID',
      actions: 'Actions',
      submit: 'Submit Report',
      cancel: 'Cancel',
      back: 'Back',
      next: 'Next Step',
      viewDetails: 'View Details',
      save: 'Save Changes',
      filter: 'Filter',
      search: 'Search reports...',
      loading: 'Loading...',
      noData: 'No records found matching criteria',
      anonymous: 'Anonymous Reporter',
      verifiedCitizen: 'Registered Citizen',
      humanReviewRecommended: 'Human Review Recommended',
      safetyNoticeTitle: 'Official Safety & Emergency Notice',
    },
    statusLabels: {
      Submitted: 'Submitted',
      'Under Review': 'Under Review',
      Assigned: 'Assigned',
      'Investigation in Progress': 'Investigation in Progress',
      Resolved: 'Resolved / Closed',
    },
    categories: {
      Theft: 'Theft',
      'Vehicle Theft': 'Vehicle Theft',
      Assault: 'Assault',
      Burglary: 'Burglary',
      Vandalism: 'Vandalism',
      Fraud: 'Fraud',
      'Cyber Crime': 'Cyber Crime',
      Harassment: 'Harassment',
      Other: 'Other',
    },
  },
  hi: {
    appName: 'Crime Watch',
    nav: {
      home: 'होम',
      reportCrime: 'अपराध रिपोर्ट करें',
      trackReport: 'रिपोर्ट ट्रैक करें',
      crimeMap: 'अपराध मानचित्र',
      login: 'लॉग इन',
      register: 'पंजीकरण',
      dashboard: 'डैशबोर्ड',
      logout: 'लॉग आउट',
      myReports: 'मेरी रिपोर्ट्स',
      overview: 'अवलोकन',
      profile: 'प्रोफ़ाइल',
      cases: 'मामले',
      analytics: 'एनालिटिक्स',
      users: 'उपयोगकर्ता प्रबंधन',
      reports: 'सभी रिपोर्ट्स',
      securityAudit: 'सुरक्षा और ऑडिट',
      statistics: 'सिस्टम सांख्यिकी',
    },
    hero: {
      heading: 'स्मार्ट रिपोर्टिंग के माध्यम से सुरक्षित समुदाय',
      subheading:
        'एआई-सहायता प्राप्त वर्गीकरण, पारदर्शी स्थिति ट्रैकिंग और अधिकृत पुलिस केस प्रबंधन के साथ एक सुरक्षित सामुदायिक रिपोर्टिंग प्लेटफ़ॉर्म।',
      reportButton: 'अपराध रिपोर्ट करें',
      trackButton: 'रिपोर्ट ट्रैक करें',
      mapButton: 'अपराध मानचित्र देखें',
      emergencyNotice:
        'सुरक्षा सूचना: Crime Watch एक रिपोर्टिंग और सामुदायिक सूचना प्लेटफ़ॉर्म है और यह आपातकालीन सेवाओं का विकल्प नहीं है। यदि आप तुरंत खतरे में हैं, तो तुरंत 112 या 100 पर कॉल करें।',
      emergencyCall: 'आपातकालीन हेल्पलाइन: 112 / 100',
    },
    features: {
      secureTitle: 'सुरक्षित अपराध रिपोर्टिंग',
      secureDesc: 'अधिकृत पुलिस अधिकारियों को सीधे सुरक्षित और एन्क्रिप्टेड रिपोर्ट भेजें।',
      anonymousTitle: 'गुमनाम रिपोर्टिंग',
      anonymousDesc: 'पूर्ण गोपनीयता के साथ रिपोर्ट करें। पहचान कभी सार्वजनिक नहीं की जाती।',
      aiTitle: 'एआई-सहायता प्राप्त विश्लेषण',
      aiDesc: 'स्वचालित प्रारंभिक वर्गीकरण अधिकारियों को त्वरित समीक्षा में मदद करता है।',
      trackingTitle: 'केस ट्रैकिंग',
      trackingDesc: 'संदर्भ संख्या (Reference ID) से सबमिशन से लेकर समाधान तक रीयल-टाइम स्थिति देखें।',
      mapTitle: 'अपराध मानचित्र',
      mapDesc: 'निजी रिपोर्टर की गोपनीयता की रक्षा करते हुए सार्वजनिक घटना वितरण देखें।',
      safetyTitle: 'सामुदायिक सुरक्षा',
      safetyDesc: 'सामूहिक डेटा और विश्लेषण नागरिकों को सुरक्षित रहने में मदद करते हैं।',
    },
    common: {
      status: 'स्थिति',
      category: 'अपराध श्रेणी',
      date: 'तारीख',
      time: 'समय',
      location: 'स्थान',
      priority: 'प्राथमिकता',
      referenceId: 'संदर्भ संख्या',
      actions: 'कार्रवाई',
      submit: 'रिपोर्ट जमा करें',
      cancel: 'रद्द करें',
      back: 'पीछे',
      next: 'अगला कदम',
      viewDetails: 'विवरण देखें',
      save: 'सहेजें',
      filter: 'फ़िल्टर',
      search: 'रिपोर्ट खोजें...',
      loading: 'लोड हो रहा है...',
      noData: 'कोई रिकॉर्ड नहीं मिला',
      anonymous: 'गुमनाम रिपोर्टर',
      verifiedCitizen: 'पंजीकृत नागरिक',
      humanReviewRecommended: 'मानव समीक्षा अनुशंसित',
      safetyNoticeTitle: 'आधिकारिक सुरक्षा एवं आपातकालीन सूचना',
    },
    statusLabels: {
      Submitted: 'जमा की गई',
      'Under Review': 'समीक्षाधीन',
      Assigned: 'अधिकारी नियुक्त',
      'Investigation in Progress': 'जांच जारी है',
      Resolved: 'हल किया गया / बंद',
    },
    categories: {
      Theft: 'चोरी',
      'Vehicle Theft': 'वाहन चोरी',
      Assault: 'हमला / मारपीट',
      Burglary: 'सेंधमारी',
      Vandalism: 'तोड़फोड़',
      Fraud: 'धोखाधड़ी',
      'Cyber Crime': 'साइबर अपराध',
      Harassment: 'उत्पीड़न',
      Other: 'अन्य',
    },
  },
  te: {
    appName: 'Crime Watch',
    nav: {
      home: 'హోమ్',
      reportCrime: 'నేరం నివేదించండి',
      trackReport: 'నివేదిక ట్రాక్ చేయండి',
      crimeMap: 'క్రైమ్ మ్యాప్',
      login: 'లాగిన్',
      register: 'రిజిస్టర్',
      dashboard: 'డాష్‌బోర్డ్',
      logout: 'లాగౌట్',
      myReports: 'నా నివేదికలు',
      overview: 'అవలోకనం',
      profile: 'ప్రొఫైల్',
      cases: 'కేసులు',
      analytics: 'విశ్లేషణలు',
      users: 'వినియోగదారు నిర్వహణ',
      reports: 'అన్ని నివేదికలు',
      securityAudit: 'భద్రత / ఆడిట్',
      statistics: 'సిస్టమ్ గణాంకాలు',
    },
    hero: {
      heading: 'తెలివైన రిపోర్టింగ్ ద్వారా సురక్షిత సమాజాలు',
      subheading:
        'AI ఆధారిత వర్గీకరణ, పారదర్శక స్థితి ట్రాకింగ్ మరియు అధీకృత పోలీసు కేస్ నిర్వహణతో కూడిన సురక్షిత సమాజ వేదిక.',
      reportButton: 'నేరం నివేదించండి',
      trackButton: 'నివేదికను ట్రాక్ చేయండి',
      mapButton: 'క్రైమ్ మ్యాప్ చూడండి',
      emergencyNotice:
        'భద్రతా గమనిక: Crime Watch అనేది రిపోర్టింగ్ మరియు సమాచార వేదిక మాత్రమే మరియు ఇది అత్యవసర సేవలకు ప్రత్యామ్నాయం కాదు. తక్షణ ప్రమాదం ఉన్నట్లయితే, వెంటనే 112 లేదా 100 కి కాల్ చేయండి.',
      emergencyCall: 'అత్యవసర హెల్ప్‌లైన్: 112 / 100',
    },
    features: {
      secureTitle: 'సురక్షిత నేర రిపోర్టింగ్',
      secureDesc: 'ఎన్‌క్రిప్టెడ్ నివేదికలను నేరుగా అధీకృత పోలీసు అధికారులకు సమర్పించండి.',
      anonymousTitle: 'అజ్ఞాత రిపోర్టింగ్',
      anonymousDesc: 'పూర్తి గోప్యతతో నివేదించండి. గుర్తింపు ఎప్పుడూ బహిర్గతం కాదు.',
      aiTitle: 'AI-సహాయక విశ్లేషణ',
      aiDesc: 'ఆటోమేటెడ్ ప్రాథమిక వర్గీకరణ ద్వారా పోలీసులకు త్వరిత పరిశీలనలో సహాయపడుతుంది.',
      trackingTitle: 'కేస్ ట్రాకింగ్',
      trackingDesc: 'రిఫరెన్స్ నంబర్ ఉపయోగించి సమర్పణ నుండి పరిష్కారం వరకు స్థితిని ట్రాక్ చేయండి.',
      mapTitle: 'క్రైమ్ మ్యాప్',
      mapDesc: 'వ్యక్తిగత గోప్యతను కాపాడుతూ పబ్లిక్ క్రైమ్ మ్యాప్‌ను పరిశీలించండి.',
      safetyTitle: 'సమాజ భద్రత',
      safetyDesc: 'సమగ్ర విశ్లేషణల ద్వారా సమాజం అప్రమత్తంగా మరియు సురక్షితంగా ఉండటానికి సహాయపడుతుంది.',
    },
    common: {
      status: 'స్థితి',
      category: 'నేర వర్గం',
      date: 'తేదీ',
      time: 'సమయం',
      location: 'స్థానం',
      priority: 'ప్రాధాన్యత',
      referenceId: 'రిఫరెన్స్ ID',
      actions: 'చర్యలు',
      submit: 'నివేదిక సమర్పించండి',
      cancel: 'రద్దు చేయి',
      back: 'వెనుకకు',
      next: 'తదుపరి దశ',
      viewDetails: 'వివరాలు చూడండి',
      save: 'సేవ్ చేయండి',
      filter: 'ఫిల్టర్',
      search: 'నివేదికలను శోధించండి...',
      loading: 'లోడ్ అవుతోంది...',
      noData: 'రికార్డులు కనుగొనబడలేదు',
      anonymous: 'అజ్ఞాత నివేదకుడు',
      verifiedCitizen: 'నమోదిత పౌరుడు',
      humanReviewRecommended: 'మానవ సమీక్ష సిఫార్సు చేయబడింది',
      safetyNoticeTitle: 'అధికారిక భద్రత మరియు అత్యవసర నోటీసు',
    },
    statusLabels: {
      Submitted: 'సమర్పించబడింది',
      'Under Review': 'సమీక్షలో ఉంది',
      Assigned: 'అధికారి కేటాయించబడ్డారు',
      'Investigation in Progress': 'దర్యాప్తు కొనసాగుతోంది',
      Resolved: 'పరిష్కరించబడింది / మూసివేయబడింది',
    },
    categories: {
      Theft: 'దొంగతనం',
      'Vehicle Theft': 'వాహనం దొంగతనం',
      Assault: 'దాడి',
      Burglary: 'ఇంటి దొంగతనం',
      Vandalism: 'విధ్వంసం',
      Fraud: 'మోసం',
      'Cyber Crime': 'సైబర్ నేరం',
      Harassment: 'వేధింపులు',
      Other: 'ఇతర',
    },
  },
};
