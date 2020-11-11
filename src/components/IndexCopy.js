// export default class UserCustomization extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             showPopup: false,
//             selectedTab: 0,
//             dashboardList: [],
//             keyMetricsList: [],
//             businessTypeList: [],
//             selectedDashboards: [], //selected list holds user selection
//             selectedKeyMetrics: [],
//             selectedBusinessType: [],
//             originalBusinessType: [], //OriginalList is used while reset
//             originalKeyMetrics: [],
//             originalDashboards: [],
//             successMessage: '',
//             saveError: ''
//         };
//     }

//     componentDidMount() {
//         this.userId = 'vn50sqm';
//         this.getKeyMetrics();
//         this.getBusinessTypes();
//         this.getDashboards();
//     }
//     getKeyMetrics = async () => {
//         await axios({
//             url: `https://ir-report-devapi.walmart.com/keymetrics/customisation/${this.userId}`,
//         }).then((res) => {
//             const metrics = res.data;
//             console.log(metrics, 'metrics');
//             const selectedMetrics = metrics && metrics.filter((metric) => metric.isActive === true);
//             const otherMetrics = metrics && metrics.filter((metric) => metric.isActive === false);
//             this.setState({
//                 keyMetricsList: otherMetrics,
//                 selectedKeyMetrics: selectedMetrics,
//                 originalKeyMetrics: metrics,
//             });
//         }).catch((error) => {
//             console.log('Error while fetching key metrics', error);
//         })
//     }

//     saveKeyMetrics = async () => {
//         const metrics = [];
//         this.state.selectedKeyMetrics.map(selectedMetric => {
//             metrics.push({
//                 ...selectedMetric,
//                 isActive: true,
//             })
//         });
//         this.state.keyMetricsList.map(metric => {
//             metrics.push({
//                 ...metric,
//                 isActive: false,
//             })
//         });
//         await axios({
//             url: `https://ir-report-devapi.walmart.com/keymetrics/customisation`,
//             headers: {
//                 "Content-type": "application/json",
//             },
//             method: 'post',
//             data: {
//                 metrics: metrics,
//                 userid: this.userId,
//             }
//         }).then(() => {
//             this.setState({
//                 originalKeyMetrics: metrics,
//                 successMessage: 'Key Metrics saved Successfully',
//             });
//             console.log('Key metrics saved Successfully');
//         }).catch((error) => {
//             this.setState({
//                 saveError: 'Error while saving key metrics',
//             });
//             console.log('Error while saving metrics', error);
//         })
//     }

//     getBusinessTypes = async () => {
//         await axios({
//             url: `https://ir-report-devapi.walmart.com/custom/getBusinessTypes/${this.userId}`,
//         }).then((res) => {
//             const businessTypesList = res.data;
//             const selectedBusinessType = businessTypesList.filter(bt => bt.isActive === true);
//             const otherBusinessType = businessTypesList.filter(bt => bt.isActive === false);
//             this.setState({
//                 businessTypeList: otherBusinessType,
//                 originalBusinessType: businessTypesList,
//                 selectedBusinessType: selectedBusinessType
//             });
//         }).catch((error) => {
//             console.log('Error while fetching business types', error);
//         })
//     }
//     renderToast = () => {
//         const handleClose = () => {
//             this.setState({
//                 saveError: '',
//                 successMessage: ''
//             })
//         }
