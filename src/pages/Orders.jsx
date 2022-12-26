import React from "react";
import axios from "axios";

import Card from "../components/Card";
import AppContext from "../context";

function Orders() {

   
    const [ orders, setOrders ] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(
                    "https://63985dc6044fa481d69abb75.mockapi.io/orders"
                );
            // console.log(data.map(obj=>obj.items).flat())
                
                setOrders(data.reduce((prev, obj) => [ ...prev, ...obj.items ], []))
                setIsLoading(false)
            } catch (error) {
                alert("ERROR")
                console.error("error in orders")
           }
        })();
    }, []);

    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>Мои заказы</h1>
            </div>

            <div className="d-flex flex-wrap">
                { isLoading ? [...Array(8)] :  orders.map((item, index) => (
                    <Card
                        key={index}
                         
                      
                        loading={isLoading}
                    
                        {...item}
                    />
                ))}
            </div>
        </div>
    );
}

export default Orders;
