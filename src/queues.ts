export const queues = [
	{
		queueName: 'training_queue1',
		options: {durable: true, autoDelete: true},
		exchange: 'training_exchange_fanout',
		routingKey: ''
	},
	{
		queueName: 'training_queue2',
		options: {durable: false, autoDelete: false},
		exchange: 'training_exchange_fanout',
		routingKey: ''

	},
	{
		queueName: 'training_order_direct',
		options: {durable: false, autoDelete: true},
		exchange: 'training_exchange_direct',
		routingKey: 'order'

	},
	{
		queueName: 'training_shipment_direct',
		options: {durable: false, autoDelete: true},
		exchange: 'training_exchange_direct',
		routingKey: 'shipment'
	},
	{
		queueName: 'training_order_topic',
		options: {durable: false, autoDelete: true},
		exchange: 'training_exchange_topic',
		routingKey: 'order.#'

	},
	{
		queueName: 'training_shipment_topic',
		options: {durable: false, autoDelete: true},
		exchange: 'training_exchange_topic',
		routingKey: 'shipment.#'
	},
	{
		queueName: 'training_order_headers_US',
		options: {durable: false, autoDelete: true},
		exchange: 'training_exchange_headers',
		routingKey: '',
		headers: {
			type: "order",
			region: "US"
		}
	},
	{
		queueName: 'training_shipment_headers_US',
		options: {durable: false, autoDelete: true},
		exchange: 'training_exchange_headers',
		routingKey: '',
		headers: {
			type: "shipment",
			region: "US"
		}
	},
	{
		queueName: 'training_order_headers_RO',
		options: {durable: false, autoDelete: true},
		exchange: 'training_exchange_headers',
		routingKey: '',
		headers: {
			type: "order",
			region: "RO"
		}
	},
	{
		queueName: 'training_shipment_headers_RO',
		options: {durable: false, autoDelete: true},
		exchange: 'training_exchange_headers',
		routingKey: '',
		headers: {
			type: "shipment",
			region: "RO"
		}		
	},
]