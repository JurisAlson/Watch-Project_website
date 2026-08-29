import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

const API_URL = `${import.meta.env.VITE_API_URL}/api/watches`;
const ADMIN_API_URL = `${import.meta.env.VITE_API_URL}/api/watches/admin/all`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const WATCHES_PER_PAGE = 5;

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
  const navigate = useNavigate();

  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login', { replace: true });
  };

  // =========================================================
  // FORM MODE
  // =========================================================

  const [formMode, setFormMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // =========================================================
  // INVENTORY FILTER
  // =========================================================

  const [inventoryFilter, setInventoryFilter] = useState('ALL');

  // =========================================================
  // PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  // =========================================================
  // SORTING
  // =========================================================

  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc',
  });

  // =========================================================
  // LOAD INVENTORY
  // =========================================================

  const loadWatches = async () => {
  setLoading(true);
  setError('');

  try {
    const response = await fetch(
      ADMIN_API_URL,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to load inventory.');
    }

    const data = await response.json();
    setWatches(data);

  } catch (err) {
    console.error(err);
    setError('Unable to load inventory.');

  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadWatches();
  }, []);

  // =========================================================
  // PRICE FORMATTER
  // =========================================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString('en-PH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const formatInputPrice = (value) => {
    const cleaned = value.replace(/[^\d.]/g, '');

    const parts = cleaned.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];

    const formattedInteger = integerPart
      ? Number(integerPart).toLocaleString('en-US')
      : '';

    if (decimalPart !== undefined) {
      return `${formattedInteger}.${decimalPart.slice(0, 2)}`;
    }

    return formattedInteger;
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredWatches = useMemo(() => {
    if (inventoryFilter === 'AVAILABLE') {
      return watches.filter(
        (watch) =>
          watch.status?.toUpperCase() === 'AVAILABLE'
      );
    }

    if (inventoryFilter === 'SOLD') {
      return watches.filter(
        (watch) =>
          watch.status?.toUpperCase() === 'SOLD'
      );
    }

    return watches;
  }, [watches, inventoryFilter]);

  // =========================================================
  // SORTING
  // =========================================================

  const handleSort = (key) => {
    setSortConfig((previous) => {
      if (previous.key === key) {
        return {
          key,
          direction:
            previous.direction === 'asc'
              ? 'desc'
              : 'asc',
        };
      }

      return {
        key,
        direction: 'asc',
      };
    });

    setCurrentPage(1);
  };

  const sortedWatches = useMemo(() => {
    const sorted = [...filteredWatches];

    sorted.sort((a, b) => {
      let valueA;
      let valueB;

      switch (sortConfig.key) {
        case 'name':
          valueA = `${a.brand || ''} ${a.modelName || ''}`
            .toLowerCase();

          valueB = `${b.brand || ''} ${b.modelName || ''}`
            .toLowerCase();

          return sortConfig.direction === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);

        case 'purchase':
          valueA = Number(a.purchasePrice || 0);
          valueB = Number(b.purchasePrice || 0);
          break;

        case 'selling':
          valueA = Number(a.targetSellingPrice || 0);
          valueB = Number(b.targetSellingPrice || 0);
          break;

        case 'status':
          valueA = a.status === 'AVAILABLE' ? 0 : 1;
          valueB = b.status === 'AVAILABLE' ? 0 : 1;
          break;

        default:
          return 0;
      }

      if (valueA < valueB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }

      if (valueA > valueB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }

      return 0;
    });

    return sorted;
  }, [filteredWatches, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return '↕';
    }

    return sortConfig.direction === 'asc'
      ? '↑'
      : '↓';
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedWatches.length / WATCHES_PER_PAGE
    )
  );

  const paginatedWatches = useMemo(() => {
    const startIndex =
      (currentPage - 1) * WATCHES_PER_PAGE;

    return sortedWatches.slice(
      startIndex,
      startIndex + WATCHES_PER_PAGE
    );
  }, [sortedWatches, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // =========================================================
  // FILTER CHANGE
  // =========================================================

  const handleFilterChange = (filter) => {
    setInventoryFilter(filter);
    setCurrentPage(1);
  };

  // =========================================================
  // FORM INPUT
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => {
      const next = {
        ...previous,
        [name]:
          type === 'checkbox'
            ? checked
            : name === 'purchasePrice' ||
                name === 'targetSellingPrice'
              ? formatInputPrice(value)
              : value,
      };

      // FULL SIZE
      if (
        name === 'wristSize' &&
        value === 'FULL SIZE'
      ) {
        next.fullLinks = true;
        next.missingLinks = false;
      }

      // FULL LINKS / MISSING LINKS
      if (
        name === 'fullLinks' &&
        checked
      ) {
        next.missingLinks = false;
      }

      if (
        name === 'missingLinks' &&
        checked
      ) {
        next.fullLinks = false;
      }

      return next;
    });

    setValidationErrors((previous) => ({
      ...previous,
      [name]: '',
    }));

    setError('');
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    const errors = {};

    const brand = form.brand.trim();
    const modelName = form.modelName.trim();
    const referenceNumber =
      form.referenceNumber.trim();

    const purchasePrice = Number(
      String(form.purchasePrice).replace(/,/g, '')
    );

    const sellingPrice = Number(
      String(form.targetSellingPrice).replace(/,/g, '')
    );

    // BASIC INFORMATION

    if (!brand) {
      errors.brand = 'Brand is required.';
    }

    if (!modelName) {
      errors.modelName =
        'Model name is required.';
    }

    if (!referenceNumber) {
      errors.referenceNumber =
        'Reference number is required.';
    }

    if (!form.category) {
      errors.category =
        'Please select a category.';
    }

    // PRICES

    if (
      form.purchasePrice === '' ||
      Number.isNaN(purchasePrice)
    ) {
      errors.purchasePrice =
        'Purchase price is required.';
    } else if (purchasePrice < 0) {
      errors.purchasePrice =
        'Purchase price cannot be negative.';
    }

    if (
      form.targetSellingPrice === '' ||
      Number.isNaN(sellingPrice)
    ) {
      errors.targetSellingPrice =
        'Selling price is required.';
    } else if (sellingPrice < 0) {
      errors.targetSellingPrice =
        'Selling price cannot be negative.';
    }

    // STATUS

    if (!form.status) {
      errors.status = 'Status is required.';
    }

    // IMAGE URL

    if (form.imageUrl.trim()) {
      try {
        new URL(form.imageUrl.trim());
      } catch {
        errors.imageUrl =
          'Please enter a valid image URL.';
      }
    }

    // WRIST SIZE

    if (!form.wristSize) {
      errors.wristSize =
        'Please select a wrist size.';
    }

    // FULL SIZE RULE

    if (
      form.wristSize === 'FULL SIZE' &&
      form.missingLinks
    ) {
      errors.missingLinks =
        'Full Size cannot have Missing Links.';
    }

    // GENERAL LINK RULE

    if (
      form.fullLinks &&
      form.missingLinks
    ) {
      errors.fullLinks =
        'Full Links and Missing Links cannot both be selected.';
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // =========================================================
  // OPEN CREATE
  // =========================================================

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });

    setMessage('');
    setError('');
    setValidationErrors({});

    setFormMode('create');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const openEditForm = (watch) => {
    setEditingId(watch.id);

    const wristSize =
      watch.wristSize || '';

    setForm({
      brand: watch.brand || '',
      modelName: watch.modelName || '',
      referenceNumber:
        watch.referenceNumber || '',
      category: watch.category || '',

      purchasePrice:
        watch.purchasePrice !== null &&
        watch.purchasePrice !== undefined
          ? formatInputPrice(
              String(watch.purchasePrice)
            )
          : '',

      targetSellingPrice:
        watch.targetSellingPrice !== null &&
        watch.targetSellingPrice !== undefined
          ? formatInputPrice(
              String(watch.targetSellingPrice)
            )
          : '',

      status:
        watch.status || 'AVAILABLE',

      imageUrl:
        watch.imageUrl || '',

      description:
        watch.description || '',

      innerBox:
        watch.innerBox ?? false,

      outerBox:
        watch.outerBox ?? false,

      manuals:
        watch.manuals ?? false,

      cardAndPapers:
        watch.cardAndPapers ?? false,

      hangtags:
        watch.hangtags ?? false,

      fullLinks:
        wristSize === 'FULL SIZE'
          ? true
          : watch.fullLinks ?? false,

      missingLinks:
        wristSize === 'FULL SIZE'
          ? false
          : watch.missingLinks ?? false,

      wristSize,
    });

    setMessage('');
    setError('');
    setValidationErrors({});

    setFormMode('edit');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const cancelForm = () => {
    setFormMode(null);
    setEditingId(null);
    setForm({ ...emptyForm });

    setValidationErrors({});
    setError('');
  };

  // =========================================================
  // SUBMIT CREATE / EDIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formMode) {
      return;
    }

    if (!validateForm()) {
      setError(
        'Please correct the highlighted fields before saving.'
      );

      return;
    }

    setSaving(true);
    setMessage('');
    setError('');

    const payload = {
      brand: form.brand.trim(),
      modelName: form.modelName.trim(),
      referenceNumber:
        form.referenceNumber.trim(),

      category: form.category,

    purchasePrice:
      Number(
        String(form.purchasePrice).replace(/,/g, '')
      ),

    targetSellingPrice:
      Number(
        String(form.targetSellingPrice).replace(/,/g, '')
      ),

      status: form.status,

      imageUrl: form.imageUrl.trim(),

      description:
        form.description.trim(),

      innerBox: form.innerBox,
      outerBox: form.outerBox,
      manuals: form.manuals,
      cardAndPapers: form.cardAndPapers,
      hangtags: form.hangtags,

      fullLinks:
        form.wristSize === 'FULL SIZE'
          ? true
          : form.fullLinks,

      missingLinks:
        form.wristSize === 'FULL SIZE'
          ? false
          : form.missingLinks,

      wristSize: form.wristSize,
    };

    try {
      const isEditing =
        formMode === 'edit';

      const url = isEditing
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = isEditing
        ? 'PUT'
        : 'POST';

const response = await fetch(url, {
  method,
  headers: getAuthHeaders(),
  body: JSON.stringify(payload),
});

      const responseText =
        await response.text();

      if (!response.ok) {
        console.error(
          'Backend response:',
          responseText
        );

        throw new Error(
          `Save failed (${response.status}): ${responseText}`
        );
      }

      setMessage(
        isEditing
          ? 'Watch updated successfully.'
          : 'Watch added successfully.'
      );

      setFormMode(null);
      setEditingId(null);
      setForm({ ...emptyForm });
      setValidationErrors({});

      await loadWatches();
    } catch (err) {
      console.error(
        'SAVE ERROR:',
        err
      );

      setError(
        err.message ||
          'Unable to save watch.'
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // MARK AS SOLD
  // =========================================================

  const markAsSold = async (id) => {
    const confirmed =
      window.confirm(
        'Mark this watch as SOLD?'
      );

    if (!confirmed) {
      return;
    }

    try {
        const token = localStorage.getItem('adminToken');

        const response = await fetch(
          `${API_URL}/${id}/sold`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      if (!response.ok) {
        throw new Error(
          'Unable to mark watch as sold.'
        );
      }

      setMessage(
        'Watch marked as sold.'
      );

      setError('');

      await loadWatches();
    } catch (err) {
      console.error(err);

      setError(
        'Unable to mark watch as sold.'
      );
    }
  };

// =========================================================
// DELETE
// =========================================================

const deleteWatch = async (id) => {
  const confirmed = window.confirm(
    'Delete this watch permanently? This cannot be undone.'
  );

  if (!confirmed) {
    return;
  }

  try {
    const token = localStorage.getItem('adminToken');

    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        'Unable to delete watch.'
      );
    }

    setMessage('Watch deleted.');
    setError('');

    await loadWatches();
  } catch (err) {
    console.error(err);

    setError(
      'Unable to delete watch.'
    );
  }
};

  // =========================================================
  // FIELD ERROR HELPER
  // =========================================================

  const fieldClass = (field) => {
    return validationErrors[field]
      ? 'has-error'
      : '';
  };

  // =========================================================
  // FILTER COUNTS
  // =========================================================

  const availableCount =
    watches.filter(
      (watch) =>
        watch.status?.toUpperCase() ===
        'AVAILABLE'
    ).length;

  const soldCount =
    watches.filter(
      (watch) =>
        watch.status?.toUpperCase() ===
        'SOLD'
    ).length;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="admin-page">

      {/* =====================================================
          NORMAL INVENTORY VIEW
      ===================================================== */}

      {!formMode && (
        <>
          <header className="admin-header">

            <div>
              <p className="admin-eyebrow">
                WATCH PROJECT
              </p>

              <h1 className="admin-title">
                Inventory Administration
              </h1>
            </div>

<div className="admin-header-actions">

  <button
    type="button"
    onClick={handleLogout}
    className="admin-logout-btn"
  >
    LOG OUT
  </button>

  <Link
    to="/"
    className="back-to-site"
  >
    ← Back to Website
  </Link>

</div>

          </header>

          <main className="admin-content">

            {/* TOOLBAR */}

            <section className="admin-toolbar">

              <div>
                <h2>
                  Inventory
                </h2>

                <p>
                  {filteredWatches.length} displayed
                  {inventoryFilter !== 'ALL' &&
                    ` · ${watches.length} total`}
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateForm}
                className="add-watch-btn"
              >
                + Add Watch
              </button>

            </section>

            {/* INVENTORY FILTER */}

            <section className="inventory-filters">

              <button
                type="button"
                className={`inventory-filter-btn ${
                  inventoryFilter === 'ALL'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleFilterChange('ALL')
                }
              >
                <span>All</span>
                <strong>
                  {watches.length}
                </strong>
              </button>

              <button
                type="button"
                className={`inventory-filter-btn ${
                  inventoryFilter === 'AVAILABLE'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleFilterChange(
                    'AVAILABLE'
                  )
                }
              >
                <span>Available</span>
                <strong>
                  {availableCount}
                </strong>
              </button>

              <button
                type="button"
                className={`inventory-filter-btn ${
                  inventoryFilter === 'SOLD'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleFilterChange('SOLD')
                }
              >
                <span>Sold</span>
                <strong>
                  {soldCount}
                </strong>
              </button>

            </section>

            {/* MESSAGES */}

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

            {/* INVENTORY */}

            <section className="inventory-table-section">

              {loading ? (

                <p className="admin-loading">
                  Loading inventory...
                </p>

              ) : filteredWatches.length === 0 ? (

                <div className="empty-inventory">

                  <h3>
                    {inventoryFilter === 'AVAILABLE'
                      ? 'No available watches.'
                      : inventoryFilter === 'SOLD'
                        ? 'No sold watches.'
                        : 'No watches in inventory.'}
                  </h3>

                  <p>
                    {inventoryFilter === 'ALL'
                      ? 'Add your first watch using the button above.'
                      : 'There are currently no watches in this category.'}
                  </p>

                </div>

              ) : (

                <>
                  <div className="table-wrapper">

                    <table className="inventory-table">

                      <thead>
                        <tr>

                          <th>ID</th>

                          <th>
                            <button
                              type="button"
                              className="sort-header"
                              onClick={() =>
                                handleSort('name')
                              }
                            >
                              Watch
                              <span>
                                {getSortIcon('name')}
                              </span>
                            </button>
                          </th>

                          <th>
                            Reference
                          </th>

                          <th>
                            Category
                          </th>

                          <th>
                            <button
                              type="button"
                              className="sort-header"
                              onClick={() =>
                                handleSort(
                                  'purchase'
                                )
                              }
                            >
                              Purchase
                              <span>
                                {getSortIcon(
                                  'purchase'
                                )}
                              </span>
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="sort-header"
                              onClick={() =>
                                handleSort(
                                  'selling'
                                )
                              }
                            >
                              Selling
                              <span>
                                {getSortIcon(
                                  'selling'
                                )}
                              </span>
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="sort-header"
                              onClick={() =>
                                handleSort(
                                  'status'
                                )
                              }
                            >
                              Availability
                              <span>
                                {getSortIcon(
                                  'status'
                                )}
                              </span>
                            </button>
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

                        {paginatedWatches.map(
                          (watch) => (
                            <tr
                              key={watch.id}
                            >

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
                                {watch.category ||
                                  '—'}
                              </td>

                              <td>
                                {formatPrice(
                                  watch.purchasePrice
                                )}
                              </td>

                              <td>
                                ₱
                                {formatPrice(
                                  watch.targetSellingPrice
                                )}
                              </td>

                              <td>
                                <span
                                  className={`status-pill ${
                                    watch.status ===
                                    'SOLD'
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
                                    type="button"
                                    onClick={() =>
                                      openEditForm(
                                        watch
                                      )
                                    }
                                    className="action-btn edit"
                                  >
                                    Edit
                                  </button>

                                  {watch.status !==
                                    'SOLD' && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        markAsSold(
                                          watch.id
                                        )
                                      }
                                      className="action-btn sold-btn"
                                    >
                                      Sold
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteWatch(
                                        watch.id
                                      )
                                    }
                                    className="action-btn delete"
                                  >
                                    Delete
                                  </button>

                                </div>
                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                  {/* PAGINATION */}

                  {totalPages > 1 && (
                    <div className="inventory-pagination">

                      <button
                        type="button"
                        className="pagination-arrow"
                        onClick={() =>
                          goToPage(
                            currentPage - 1
                          )
                        }
                        disabled={
                          currentPage === 1
                        }
                      >
                        ←
                      </button>

                      <div className="pagination-info">

                        <span>
                          Page
                        </span>

                        <strong>
                          {currentPage}
                        </strong>

                        <span>
                          of
                        </span>

                        <strong>
                          {totalPages}
                        </strong>

                      </div>

                      <button
                        type="button"
                        className="pagination-arrow"
                        onClick={() =>
                          goToPage(
                            currentPage + 1
                          )
                        }
                        disabled={
                          currentPage ===
                          totalPages
                        }
                      >
                        →
                      </button>

                    </div>
                  )}

                </>
              )}

            </section>

          </main>
        </>
      )}

      {/* =====================================================
          FULLSCREEN CREATE / EDIT WORKSPACE
      ===================================================== */}

      {formMode && (
        <div className="admin-editor">

          <header className="editor-header">

            <div>

              <p className="admin-eyebrow">
                {formMode === 'edit'
                  ? 'EDIT RECORD'
                  : 'NEW RECORD'}
              </p>

              <h1 className="editor-title">
                {formMode === 'edit'
                  ? 'Edit Watch'
                  : 'Add Watch'}
              </h1>

              <p className="editor-subtitle">
                {formMode === 'edit'
                  ? `Editing inventory record #${editingId}`
                  : 'Create a new inventory record'}
              </p>

            </div>

            <button
              type="button"
              onClick={cancelForm}
              className="editor-close-btn"
            >
              ×
            </button>

          </header>

          <main className="editor-content">

            {error && (
              <div className="admin-message error">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="watch-form"
              noValidate
            >

              <div className="form-grid">

                {/* BASIC INFORMATION */}

                <div className="form-section-heading form-group-full">

                  <p className="admin-eyebrow">
                    TIMEPIECE INFORMATION
                  </p>

                  <h2>
                    Basic Information
                  </h2>

                </div>

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
                    className={fieldClass(
                      'brand'
                    )}
                    placeholder="Seiko"
                  />

                  {validationErrors.brand && (
                    <small className="field-error">
                      {validationErrors.brand}
                    </small>
                  )}

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
                    className={fieldClass(
                      'modelName'
                    )}
                    placeholder="Alpinist"
                  />

                  {validationErrors.modelName && (
                    <small className="field-error">
                      {validationErrors.modelName}
                    </small>
                  )}

                </div>

                {/* REFERENCE */}

                <div className="form-group">

                  <label>
                    Reference Number
                  </label>

                  <input
                    type="text"
                    name="referenceNumber"
                    value={
                      form.referenceNumber
                    }
                    onChange={handleChange}
                    className={fieldClass(
                      'referenceNumber'
                    )}
                    placeholder="SPB121J1"
                  />

                  {validationErrors.referenceNumber && (
                    <small className="field-error">
                      {
                        validationErrors
                          .referenceNumber
                      }
                    </small>
                  )}

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
                    className={fieldClass(
                      'category'
                    )}
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

                  {validationErrors.category && (
                    <small className="field-error">
                      {validationErrors.category}
                    </small>
                  )}

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
                    className={fieldClass(
                      'wristSize'
                    )}
                  >

                    <option value="">
                      Select Wrist Size
                    </option>

                    <option value="FULL SIZE">
                      Full Size
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

                  {validationErrors.wristSize && (
                    <small className="field-error">
                      {validationErrors.wristSize}
                    </small>
                  )}

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
                    className={fieldClass(
                      'status'
                    )}
                  >

                    <option value="AVAILABLE">
                      AVAILABLE
                    </option>

                    <option value="SOLD">
                      SOLD
                    </option>

                  </select>

                  {validationErrors.status && (
                    <small className="field-error">
                      {validationErrors.status}
                    </small>
                  )}

                </div>

                {/* PRICING */}

                <div className="form-section-heading form-group-full">

                  <p className="admin-eyebrow">
                    FINANCIAL
                  </p>

                  <h2>
                    Pricing
                  </h2>

                </div>

                {/* PURCHASE */}

                <div className="form-group">

                  <label>
                    Purchase Price
                  </label>

                  <div className="price-input">

                    <input
                      type="text"
                      inputMode="decimal"
                      name="purchasePrice"
                      value={
                        form.purchasePrice
                      }
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={fieldClass(
                        'purchasePrice'
                      )}
                      placeholder="0"
                    />

                  </div>

                  {validationErrors.purchasePrice && (
                    <small className="field-error">
                      {
                        validationErrors
                          .purchasePrice
                      }
                    </small>
                  )}

                </div>

                {/* SELLING */}

                <div className="form-group">

                  <label>
                    Target Selling Price
                  </label>

                  <div className="price-input">

                    <input
                      type="text"
                      inputMode="decimal"
                      name="targetSellingPrice"
                      value={
                        form.targetSellingPrice
                      }
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={fieldClass(
                        'targetSellingPrice'
                      )}
                      placeholder="0"
                    />

                  </div>

                  {validationErrors.targetSellingPrice && (
                    <small className="field-error">
                      {
                        validationErrors
                          .targetSellingPrice
                      }
                    </small>
                  )}

                </div>

                {/* IMAGE */}

                <div className="form-section-heading form-group-full">

                  <p className="admin-eyebrow">
                    MEDIA
                  </p>

                  <h2>
                    Product Image
                  </h2>

                </div>

                <div className="form-group form-group-full">

                  <label>
                    Image URL
                  </label>

                  <input
                    type="url"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    className={fieldClass(
                      'imageUrl'
                    )}
                    placeholder="https://..."
                  />

                  {validationErrors.imageUrl && (
                    <small className="field-error">
                      {validationErrors.imageUrl}
                    </small>
                  )}

                </div>

                {/* INCLUDED ITEMS */}

                <div className="form-section-heading form-group-full">

                  <p className="admin-eyebrow">
                    CONDITION &amp; ACCESSORIES
                  </p>

                  <h2>
                    Included Items
                  </h2>

                  <p>
                    Select everything included
                    with the watch.
                  </p>

                </div>

                <div className="form-group form-group-full">

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
                        checked={
                          form.cardAndPapers
                        }
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

                    {/* FULL LINKS */}

                    <label
                      className={`checkbox-item ${
                        form.fullLinks
                          ? 'selected'
                          : ''
                      }`}
                    >

                      <input
                        type="checkbox"
                        name="fullLinks"
                        checked={
                          form.fullLinks
                        }
                        onChange={handleChange}
                        disabled={
                          form.wristSize ===
                          'FULL SIZE'
                        }
                      />

                      <span>
                        Full Links
                      </span>

                    </label>

                    {/* MISSING LINKS */}

                    <label
                      className={`checkbox-item ${
                        form.missingLinks
                          ? 'selected'
                          : ''
                      } ${
                        validationErrors.missingLinks
                          ? 'checkbox-error'
                          : ''
                      }`}
                    >

                      <input
                        type="checkbox"
                        name="missingLinks"
                        checked={
                          form.missingLinks
                        }
                        onChange={handleChange}
                        disabled={
                          form.wristSize ===
                          'FULL SIZE'
                        }
                      />

                      <span>
                        Missing Links
                      </span>

                    </label>

                  </div>

                  {form.wristSize ===
                    'FULL SIZE' && (
                    <small className="field-hint">
                      Full Size automatically
                      includes Full Links.
                      Missing Links cannot be
                      selected.
                    </small>
                  )}

                  {validationErrors.fullLinks && (
                    <small className="field-error">
                      {
                        validationErrors
                          .fullLinks
                      }
                    </small>
                  )}

                  {validationErrors.missingLinks && (
                    <small className="field-error">
                      {
                        validationErrors
                          .missingLinks
                      }
                    </small>
                  )}

                </div>

                {/* DESCRIPTION */}

                <div className="form-section-heading form-group-full">

                  <p className="admin-eyebrow">
                    RECORD NOTES
                  </p>

                  <h2>
                    Description
                  </h2>

                </div>

                <div className="form-group form-group-full">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="7"
                    placeholder="Describe the watch, condition, provenance, notable details, etc."
                  />

                </div>

              </div>

              {/* ACTIONS */}

              <div className="editor-actions">

                <button
                  type="button"
                  onClick={cancelForm}
                  className="cancel-btn"
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : formMode === 'edit'
                      ? 'Save Changes'
                      : 'Create Watch'}
                </button>

              </div>

            </form>

          </main>

        </div>
      )}

    </div>
  );
}

export default Admin;