testServiceFactory.$inject = ['$http'];
function testServiceFactory($http) {
    class TestService {
        static hello(name) {
            return `Hello ${name}`;
        }
    }
    
    return TestService;
}

export default testServiceFactory;