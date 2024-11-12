<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">
                          Name
                      </label>
                      <input
                          type="text"
                          id="name"
                          name="name"
                          value={product.name}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                      />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="price">
                          Price
                      </label>
                      <input
                          type="number"
                          id="price"
                          name="price"
                          value={product.price}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                      />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="description">
                          Description
                      </label>
                      <textarea 
                          id="description"
                          name="description"
                          value={product.description}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                      />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="category">
                          Category
                      </label>
                      <select
                          id="category"
                          name="category"
                          value={product.category}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                      >
                          {categories.map((category) => (
                              <option key={category.value} value={category.value}>
                                  {category.label}
                              </option>
                          ))}
                      </select>
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="colour">
                          Colour
                      </label>
                      <select
                          id="colour"
                          name="colour"
                          value={product.colour}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                      >
                          {colours.map((colour) => (
                              <option key={colour.value} value={colour.value}>
                                  {colour.label}
                              </option>
                          ))}
                      </select>
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="image">
                          Image
                      </label>
                      <input
                          type="file"
                          id="image"
                          name="image"
                          onChange={(e) => setImage(e.target.files[0])}
                          className="w-full p-2 border border-gray-300 rounded-md"
                      />
                  </div>
              </div>
              <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                  Add Product
              </button>