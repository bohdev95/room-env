import { Storage } from "@google-cloud/storage";

// TODO
// TODO
// move these test items into encrypted files along with prod keys
const PROJECT_ID = "hk-dev-50970";
const BUCKET_NAME = "hk-dev-test-50";
const PRIVATE_KEY =
  "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC1gAg8L5slRHMN\n7YLdx2Y20IdF4dlCWxZ+E7Cr+GL7H/ZX2t/arR1dzIsbBtlE+VEshN7l5LDfEsIh\nOnriGG1bQ7EHqGOMGVz/lIdGNtGcXgLsdYjSMLJY6IrEc1n4jAdq6sJ20/nUUhNm\nP8g4e1nkDEmyIgBVLxz3alBruGI1h13kc0oL7Fq1JwGFCH2JcrnBJmtjSoCINz0F\nSoxix3IOTROLV8SDq1S/ZnZLSRc/u8wgH4uUjXitkO1hB8wXlR9MTiRyf3nyn5BH\nsU/2h6nnu79DZn2sYN8mtKPUy2DYuPvRRygo1Sp4V6kRp4NhXniP8D7uOzyjG+Je\nzpVc9zFvAgMBAAECggEADp1+DEVTxkR6H1JTihhXGsLf9w32DhSCUyoIEqZbEhhu\nIH+iLFxpqPaiR6LdjA2ng7Y6B2PK+lZAW6dMjeL5q10KvFsgPlUshUgokcwy74HX\n1RgB1IB8sWbIWy65Z/zz+/VmLhC+ZWKBPWfqxOGUniXUfrZONeMn/08IUCRLhD58\ntC/ezGcOYmJ6lS0TmbiefwkXyOywfeaki6/vKiVRwyhA1u+Z8FDq79EADBaDxIws\nLPHr82exB6p1p6CU8RB5sWihO6QPZjxZSv6Mi7dVpkCFVnP8cZvcodquWfhHsYl8\nsGBYqPe1sY6KVzQZXgZlVnbJF2qM95tgQRmnBfsLgQKBgQDv7li7h2hq/KYQdhas\n9X2he/Ys/+OCrAV395e/0AnAnJQ3PD24C58ZLZP5yqLUsxoHNFeOfviBgrelh0nC\nziCoP3IpsK/ArYlHXc9e8bi94QxT4lL/aNxzEo1siLg1yKfX1mPZCS8z7FriFCP/\n/53GuxMU11x7vqSgVOVdaDvk6QKBgQDBp+D6ENgDcVCUU0MkuBo1x9w30pAPEYgx\nFYBXJPT/jbHwqFZqpVBgRZGOG26Dd87hU1wwkbfvkQB6EdcKHNKBDHznBE2zVl5c\nOEgHB3dHupT8T2tQ+cSrUPwhNcMk5RAP9+1ZR3kC514f1ulKXHXkTd9ik6dODAhn\nmBzTl35MlwKBgQCxVdJhsOB9iwVWz2FNLxlPHOdENVG8CFb2Z5rSm/pJUbG+7ZiU\niopqOqTPkHUvjr0jLA229aPJXYtNHiRnhqDemh5QMBaG6/y2MeEOxMyOE2NgMLy1\nqJSfvMuot5insApWXlBoXwBzeTNnPAmrsgu0khq1YcQqdisJkhYBJwR12QKBgHws\nkIboXArBEyE4znnyDuRjViL5QmRXIpQOrG+0g+CF1A5zco4JmKNSmIWds1xba21y\nTU/bcC0ONlcPr2qNlrEm98QOL2CKRhEuCYlwURzOWA/9QNv4fBI56KHG3m1+77C9\nkhTITqD9CI6z+H01EmclQ9LqyMGz14PNttY6csLbAoGBAM7b+z0OtcGAWM/QZCMu\n6e7l7bvSuZdWIWC1uDyG7KdOarqDwoNOxUKNPO4xcdhTP19gCYNgepMMUDIgzWSR\n6Vj7s/t400Hjcd5C5SeCSi55n67xRLsEK/U3ODF91rKYA1IOXulsbZ/ZxcE3wPmz\n12ksCNWB0vE3t6PhScwpPBJe\n-----END PRIVATE KEY-----\n";
const CLIENT_EMAIL = "hk-dev-bucket@hk-dev-50970.iam.gserviceaccount.com";

const storage = new Storage({
  projectId: PROJECT_ID,
  credentials: {
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  },
});

const bucket = storage.bucket(BUCKET_NAME as string);

export const createWriteStream = (filename: string, contentType?: string) => {
  const ref = bucket.file(filename);

  const stream = ref.createWriteStream({
    gzip: true,
    contentType: contentType,
  });

  return stream;
};
