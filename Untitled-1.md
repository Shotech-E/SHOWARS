<div className="section__container p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
      <table className="items-center bg-transparent w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 border-b">Order Id</th>
            <th className="py-3 px-4 border-b">Customer Email</th>
            <th className="py-3 px-4 border-b">Status</th>
            <th className="py-3 px-4 border-b">Date</th>
            <th className="py-3 px-4 border-b">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders &&
            orders.map((order, index) => (
              <tr key={index}>
                <td className="py-3 px-4 border-b">{order?.orderId}</td>
                <td className="py-3 px-4 border-b">{order?.email}</td>
                <td className="py-3 px-4 border-b">
                  <span
                    className={`inline-block px-3 py-1 text-xs text-white rounded-full ${getStatusColor(
                      order?.status
                    )}`}
                  >
                    {order?.status}
                  </span>
                </td>
                <td className="py-3 px-4 border-b">
                  {formatDate(order?.updatedAt)}
                </td>
                <td className="py-3 px-4 border-b flex items-center space-x-4">
                  <Link to="#" className="text-blue-500 hover:underline">
                    <i className="ri-eye-line mr-2 text-yellow-500 hover:text-yellow-900"></i>
                  </Link>
                  <button
                    className="text-green-500 hover:underline"
                    onClick={() => handleEditOrder(order)}
                  >
                    <i className="ri-edit-box-line mr-2 text-green-500 hover:text-green-900"></i>
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDeleteOder(order?._id)}
                  >
                    <i className="ri-delete-bin-2-line text-red-500 hover:text-red-900"></i>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* update order modal */}
      {selectedOrder && (
        <UpdateOrderModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
