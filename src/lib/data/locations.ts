export type Location = { vi: string; en: string; search: string };

function loc(vi: string, en: string, keywords: string): Location {
  return { vi, en, search: keywords.toLowerCase() };
}

export const LOCATIONS: Location[] = [
  loc("Hoa Kỳ - California, PST/PDT", "United States - California, PST/PDT", "california cali ca usa us hoa ky"),
  loc("Hoa Kỳ - Texas, CST/CDT", "United States - Texas, CST/CDT", "texas tx usa us hoa ky"),
  loc("Hoa Kỳ - Washington, PST/PDT", "United States - Washington, PST/PDT", "washington wa seattle usa us hoa ky"),
  loc("Hoa Kỳ - Florida, EST/EDT", "United States - Florida, EST/EDT", "florida fl usa us hoa ky"),
  loc("Hoa Kỳ - Virginia, EST/EDT", "United States - Virginia, EST/EDT", "virginia va usa us hoa ky"),
  loc("Hoa Kỳ - Georgia, EST/EDT", "United States - Georgia, EST/EDT", "georgia ga atlanta usa us hoa ky"),
  loc("Hoa Kỳ - Massachusetts, EST/EDT", "United States - Massachusetts, EST/EDT", "massachusetts ma boston usa us hoa ky"),
  loc("Hoa Kỳ - Louisiana, CST/CDT", "United States - Louisiana, CST/CDT", "louisiana la usa us hoa ky"),
  loc("Hoa Kỳ - Oklahoma, CST/CDT", "United States - Oklahoma, CST/CDT", "oklahoma ok usa us hoa ky"),
  loc("Hoa Kỳ - Pennsylvania, EST/EDT", "United States - Pennsylvania, EST/EDT", "pennsylvania pa philadelphia usa us hoa ky"),
  loc("Hoa Kỳ - New York, EST/EDT", "United States - New York, EST/EDT", "new york ny nyc usa us hoa ky"),
  loc("Hoa Kỳ - Illinois, CST/CDT", "United States - Illinois, CST/CDT", "illinois il chicago usa us hoa ky"),
  loc("Hoa Kỳ - Arizona, MST", "United States - Arizona, MST", "arizona az usa us hoa ky"),
  loc("Hoa Kỳ - Oregon, PST/PDT", "United States - Oregon, PST/PDT", "oregon or portland usa us hoa ky"),
  loc("Hoa Kỳ - Minnesota, CST/CDT", "United States - Minnesota, CST/CDT", "minnesota mn usa us hoa ky"),
  loc("Hoa Kỳ - North Carolina, EST/EDT", "United States - North Carolina, EST/EDT", "north carolina nc usa us hoa ky"),
  loc("Hoa Kỳ - Colorado, MST/MDT", "United States - Colorado, MST/MDT", "colorado co denver usa us hoa ky"),
  loc("Canada - Ontario, EST/EDT", "Canada - Ontario, EST/EDT", "canada ontario toronto"),
  loc("Canada - British Columbia, PST/PDT", "Canada - British Columbia, PST/PDT", "canada british columbia vancouver bc"),
  loc("Canada - Alberta, MST/MDT", "Canada - Alberta, MST/MDT", "canada alberta calgary edmonton"),
  loc("Úc - New South Wales, AEST/AEDT", "Australia - New South Wales, AEST/AEDT", "uc australia new south wales sydney nsw"),
  loc("Úc - Victoria, AEST/AEDT", "Australia - Victoria, AEST/AEDT", "uc australia victoria melbourne"),
  loc("Úc - Queensland, AEST", "Australia - Queensland, AEST", "uc australia queensland brisbane qld"),
  loc("Úc - Western Australia, AWST", "Australia - Western Australia, AWST", "uc australia western australia perth wa"),
  loc("Đức, CET/CEST", "Germany, CET/CEST", "duc germany berlin"),
  loc("Pháp, CET/CEST", "France, CET/CEST", "phap france paris"),
  loc("Anh, GMT/BST", "United Kingdom, GMT/BST", "anh uk england london"),
  loc("Nhật Bản, JST", "Japan, JST", "nhat ban japan tokyo"),
  loc("Hàn Quốc, KST", "South Korea, KST", "han quoc korea seoul"),
  loc("Séc, CET/CEST", "Czech Republic, CET/CEST", "sec czech prague"),
  loc("Na Uy, CET/CEST", "Norway, CET/CEST", "na uy norway oslo"),
  loc("New Zealand, NZST/NZDT", "New Zealand, NZST/NZDT", "new zealand auckland nz"),
];
