export default interface ICustomApi {
    url: string, //has to be js template with x & y properties e.g. "https://someapi.com/${lat}/${lon}"
    propertyAccess: string, //has to be sequence of nested objects properties separated with dot e.g. "propA.propB.propC"
    maxRatingValue: number, //maximum value of rating - needed to map this value to 1-100
    importance: number, //value to set importance level of this api for user (1-100)
    ascending?: boolean, //defines if bigger is better (default: true)
}
