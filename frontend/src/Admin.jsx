import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const emptyForm = {
  brand: 'Seiko',
  modelName: '',
  referenceNumber: '',
  category: '',
  purchasePrice: '',
  targetSellingPrice: '',
  status: 'AVAILABLE',
  imageUrl: '',
  description: '',

  innerBox: false,
  outerBox: false,
  manuals: false,
  cardAndPapers: false,
  hangtags: false,
  fullLinks: false,
  missingLinks: false,

  wristSize: '',
};

function Admin() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:8080/api/watches';

  // -----------------------------------------
  // LOAD INVENTORY
  // -----------------------------------------

  const loadWatches = () => {
    setLoading(true);

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load inventory.');
        }

        return res.json();
      })
      .then((data) => {
        setWatches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load inventory.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadWatches();
  }, []);

  // -----------------------------------------
  // FORM INPUT
  // -----------------------------------------

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // -----------------------------------------
  // OPEN ADD FORM
  // -----------------------------------------

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage('');
    setError('');
    setShowForm(true);
  };

  // -----------------------------------------
  // OPEN EDIT FORM
  // -----------------------------------------

  const openEditForm = (watch) => {
    setEditingId(watch.id);

    setForm({
      brand: watch.brand || '',
      modelName: watch.modelName || '',
      referenceNumber: watch.referenceNumber || '',
      category: watch.category || '',
      purchasePrice: watch.purchasePrice ?? '',
      targetSellingPrice: watch.targetSellingPrice ?? '',
      status: watch.status || 'AVAILABLE',
      imageUrl: watch.imageUrl || '',
      description: watch.description || '',

      innerBox: watch.innerBox ?? false,
      outerBox: watch.outerBox ?? false,
      manuals: watch.manuals ?? false,
      cardAndPapers: watch.cardAndPapers ?? false,
      hangtags: watch.hangtags ?? false,
      fullLinks: watch.fullLinks ?? false,
      missingLinks: watch.missingLinks ?? false,

      wristSize: watch.wristSize || '',
    });

    setMessage('');
    setError('');
    setShowForm(true);
  };

  // -----------------------------------------
  // SUBMIT ADD / EDIT
  // -----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    const payload = {
      brand: form.brand,
      modelName: form.modelName,
      referenceNumber: form.referenceNumber,
      category: form.category,

      purchasePrice: Number(form.purchasePrice),
      targetSellingPrice: Number(form.targetSellingPrice),

      status: form.status,
      imageUrl: form.imageUrl,
      description: form.description,

      innerBox: form.innerBox,
      outerBox: form.outerBox,
      manuals: form.manuals,
      cardAndPapers: form.cardAndPapers,
      hangtags: form.hangtags,
      fullLinks: form.fullLinks,
      missingLinks: form.missingLinks,

      wristSize: form.wristSize,
    };

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error('Backend response:', responseText);

        throw new Error(
          `Save failed (${response.status}): ${responseText}`
        );
      }

      setMessage(
        editingId
          ? 'Watch updated successfully.'
          : 'Watch added successfully.'
      );

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      loadWatches();

    } catch (err) {
      console.error('SAVE ERROR:', err);
      setError(err.message);
    }
  };

  // -----------------------------------------
  // MARK AS SOLD
  // -----------------------------------------

  const markAsSold = async (id) => {
    const confirmed = window.confirm(
      'Mark this watch as SOLD?'
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}/sold`,
        {
          method: 'PATCH',
        }
      );

      if (!response.ok) {
        throw new Error(
          'Unable to mark watch as sold.'
        );
      }

      setMessage('Watch marked as sold.');
      setError('');

      loadWatches();

    } catch (err) {
      console.error(err);
      setError(
        'Unable to mark watch as sold.'
      );
    }
  };

  // -----------------------------------------
  // DELETE
  // -----------------------------------------

  const deleteWatch = async (id) => {
    const confirmed = window.confirm(
      'Delete this watch permanently? This cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(
          'Unable to delete watch.'
        );
      }

      setMessage('Watch deleted.');
      setError('');

      loadWatches();

    } catch (err) {
      console.error(err);
      setError(
        'Unable to delete watch.'
      );
    }
  };

  // -----------------------------------------
  // CANCEL FORM
  // -----------------------------------------

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  return (
    <div className="admin-page">

      {/* ========================================
          ADMIN HEADER
      ======================================== */}

      <header className="admin-header">

        <div>

          <p className="admin-eyebrow">
            WATCH PROJECT
          </p>

          <h1 className="admin-title">
            Inventory Administration
          </h1>

        </div>

        <Link
          to="/"
          className="back-to-site"
        >
          ← Back to Website
        </Link>

      </header>


      <main className="admin-content">

        {/* ========================================
            TOP ACTION BAR
        ======================================== */}

        <section className="admin-toolbar">

          <div>

            <h2>
              Inventory
            </h2>

            <p>
              {watches.length} total timepieces
            </p>

          </div>

          <button
            onClick={openAddForm}
            className="add-watch-btn"
          >
            + Add Watch
          </button>

        </section>


        {/* ========================================
            MESSAGES
        ======================================== */}

        {message && (
          <div className="admin-message success">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-message error">
            {error}
          </div>
        )}


        {/* ========================================
            ADD / EDIT FORM
        ======================================== */}

        {showForm && (

          <section className="admin-form-section">

            <div className="form-header">

              <div>

                <p className="admin-eyebrow">
                  {editingId
                    ? 'EDIT RECORD'
                    : 'NEW RECORD'}
                </p>

                <h2>
                  {editingId
                    ? 'Edit Watch'
                    : 'Add Watch'}
                </h2>

              </div>

              <button
                type="button"
                onClick={cancelForm}
                className="close-form-btn"
              >
                Cancel
              </button>

            </div>


            <form
              onSubmit={handleSubmit}
              className="watch-form"
            >

              <div className="form-grid">

                {/* BRAND */}

                <div className="form-group">

                  <label>
                    Brand
                  </label>

                  <input
                    type="text"
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* MODEL */}

                <div className="form-group">

                  <label>
                    Model Name
                  </label>

                  <input
                    type="text"
                    name="modelName"
                    value={form.modelName}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* REFERENCE */}

                <div className="form-group">

                  <label>
                    Reference Number
                  </label>

                  <input
                    type="text"
                    name="referenceNumber"
                    value={form.referenceNumber}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* CATEGORY */}

                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Category
                    </option>

                    <option value="Prospex">
                      Prospex
                    </option>

                    <option value="Presage">
                      Presage
                    </option>

                    <option value="Seiko 5">
                      Seiko 5
                    </option>

                    <option value="GMT">
                      GMT
                    </option>

                    <option value="Diver">
                      Diver
                    </option>

                    <option value="Field">
                      Field
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>


                {/* PURCHASE PRICE */}

                <div className="form-group">

                  <label>
                    Purchase Price
                  </label>

                  <input
                    type="number"
                    name="purchasePrice"
                    value={form.purchasePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />

                </div>


                {/* SELLING PRICE */}

                <div className="form-group">

                  <label>
                    Target Selling Price
                  </label>

                  <input
                    type="number"
                    name="targetSellingPrice"
                    value={form.targetSellingPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />

                </div>


                {/* STATUS */}

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >

                    <option value="AVAILABLE">
                      AVAILABLE
                    </option>

                    <option value="SOLD">
                      SOLD
                    </option>

                  </select>

                </div>


                {/* WRIST SIZE */}

                <div className="form-group">

                  <label>
                    Wrist Size
                  </label>

                  <select
                    name="wristSize"
                    value={form.wristSize}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select Wrist Size
                    </option>

                    <option value="7.5 inches">
                      7.5 inches
                    </option>

                    <option value="8 inches">
                      8 inches
                    </option>

                    <option value="8.5 inches">
                      8.5 inches
                    </option>

                  </select>

                </div>


                {/* IMAGE URL */}

                <div className="form-group form-group-full">

                  <label>
                    Image URL
                  </label>

                  <input
                    type="url"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                  />

                </div>


                {/* =====================================
                    INCLUDED ITEMS
                ====================================== */}

                <div className="form-group form-group-full">

                  <label>
                    Included Items
                  </label>

                  <div className="checkbox-grid">

                    <label className="checkbox-item">

                      <input
                        type="checkbox"
                        name="innerBox"
                        checked={form.innerBox}
                        onChange={handleChange}
                      />

                      <span>
                        Inner Box
                      </span>

                    </label>


                    <label className="checkbox-item">

                      <input
                        type="checkbox"
                        name="outerBox"
                        checked={form.outerBox}
                        onChange={handleChange}
                      />

                      <span>
                        Outer Box
                      </span>

                    </label>


                    <label className="checkbox-item">

                      <input
                        type="checkbox"
                        name="manuals"
                        checked={form.manuals}
                        onChange={handleChange}
                      />

                      <span>
                        Manuals
                      </span>

                    </label>


                    <label className="checkbox-item">

                      <input
                        type="checkbox"
                        name="cardAndPapers"
                        checked={form.cardAndPapers}
                        onChange={handleChange}
                      />

                      <span>
                        Card &amp; Papers
                      </span>

                    </label>


                    <label className="checkbox-item">

                      <input
                        type="checkbox"
                        name="hangtags"
                        checked={form.hangtags}
                        onChange={handleChange}
                      />

                      <span>
                        Hangtags
                      </span>

                    </label>


                    <label className="checkbox-item">

                      <input
                        type="checkbox"
                        name="fullLinks"
                        checked={form.fullLinks}
                        onChange={handleChange}
                      />

                      <span>
                        Full Links
                      </span>

                    </label>


                    <label className="checkbox-item">

                      <input
                        type="checkbox"
                        name="missingLinks"
                        checked={form.missingLinks}
                        onChange={handleChange}
                      />

                      <span>
                        Missing Links
                      </span>

                    </label>

                  </div>

                </div>


                {/* DESCRIPTION */}

                <div className="form-group form-group-full">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe the watch, condition, provenance, notable details, etc."
                  />

                </div>

              </div>


              {/* FORM ACTIONS */}

              <div className="form-actions">

                <button
                  type="button"
                  onClick={cancelForm}
                  className="cancel-btn"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingId
                    ? 'Save Changes'
                    : 'Create Watch'}
                </button>

              </div>

            </form>

          </section>

        )}


        {/* ========================================
            INVENTORY TABLE
        ======================================== */}

        <section className="inventory-table-section">

          {loading ? (

            <p className="admin-loading">
              Loading inventory...
            </p>

          ) : watches.length === 0 ? (

            <div className="empty-inventory">

              <h3>
                No watches in inventory.
              </h3>

              <p>
                Add your first watch using the
                button above.
              </p>

            </div>

          ) : (

            <div className="table-wrapper">

              <table className="inventory-table">

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Watch
                    </th>

                    <th>
                      Reference
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Purchase
                    </th>

                    <th>
                      Selling
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Published
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {watches.map((watch) => (

                    <tr key={watch.id}>

                      <td>
                        #{watch.id}
                      </td>


                      <td>

                        <div className="table-watch-name">

                          <strong>
                            {watch.brand}
                          </strong>

                          <span>
                            {watch.modelName}
                          </span>

                        </div>

                      </td>


                      <td>
                        {watch.referenceNumber}
                      </td>


                      <td>
                        {watch.category || '—'}
                      </td>


                      <td>
                        ₱ {Number(
                          watch.purchasePrice
                        ).toLocaleString()}
                      </td>


                      <td>
                        ₱ {Number(
                          watch.targetSellingPrice
                        ).toLocaleString()}
                      </td>


                      <td>

                        <span
                          className={`status-pill ${
                            watch.status === 'SOLD'
                              ? 'sold'
                              : 'available'
                          }`}
                        >
                          {watch.status}
                        </span>

                      </td>


                      <td>

                        {watch.publishedDate
                          ? new Date(
                              watch.publishedDate
                            ).toLocaleDateString()
                          : '—'}

                      </td>


                      <td>

                        <div className="table-actions">

                          <button
                            onClick={() =>
                              openEditForm(watch)
                            }
                            className="action-btn edit"
                          >
                            Edit
                          </button>


                          {watch.status !== 'SOLD' && (

                            <button
                              onClick={() =>
                                markAsSold(watch.id)
                              }
                              className="action-btn sold-btn"
                            >
                              Sold
                            </button>

                          )}


                          <button
                            onClick={() =>
                              deleteWatch(watch.id)
                            }
                            className="action-btn delete"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Admin;