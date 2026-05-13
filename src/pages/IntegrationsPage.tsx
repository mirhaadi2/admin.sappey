import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Form/Input";
import { Select } from "../components/Form/Select";
import {
    Truck,
    MapPin,
    MagnifyingGlass as Search,
    X,
    CheckCircle,
    Warning as AlertCircle,
    FileText,
    Calculator,
    Package as PackageIcon,
    Clock,
    PuzzlePiece,
} from "@phosphor-icons/react";
import { useDelhiveryApi } from "../api/integrations/delhivery";

const IntegrationsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState("delhivery");

    const tabs = [
        { id: "delhivery", label: "Delhivery", icon: <Truck size={16} /> },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Integrations</h1>
                    <p className="text-slate-600 mt-1">
                        Manage third-party service integrations
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <PuzzlePiece size={20} />
                        {tabs.find((tab) => tab.id === activeTab)?.label}
                    </h2>
                </CardHeader>
                <CardBody>
                    {activeTab === "delhivery" && <DelhiveryIntegration />}
                </CardBody>
            </Card>
        </div>
    );
};

const DelhiveryIntegration: React.FC = () => {
    const [pincode, setPincode] = useState("");
    const [waybill, setWaybill] = useState("");
    const [serviceabilityResult, setServiceabilityResult] = useState<boolean | null>(null);
    const [trackingResult, setTrackingResult] = useState<any>(null);
    const [chargesResult, setChargesResult] = useState<any>(null);
    const [packingSlipResult, setPackingSlipResult] = useState<any>(null);

    // Shipment forms
    const [createShipmentData, setCreateShipmentData] = useState({
        customerName: "",
        address: "",
        pincode: "",
        city: "",
        state: "",
        phone: "",
        orderId: "",
        isPrepaid: true,
        totalAmount: 0,
        totalItems: 1,
    });

    const [editShipmentData, setEditShipmentData] = useState({
        waybill: "",
        pt: "Pre-paid",
        cod: 0,
        shipment_height: 0,
        gm: 0,
    });

    const [cancelWaybill, setCancelWaybill] = useState("");

    const [ewaybillData, setEwaybillData] = useState({
        waybill: "",
        dcn: "",
        ewbn: "",
    });

    const [chargesParams, setChargesParams] = useState({
        md: "E",
        ss: "Delivered",
        d_pin: "",
        o_pin: "",
        cgm: 0,
        pt: "Pre-paid",
    });

    const [packingSlipParams, setPackingSlipParams] = useState({
        wbns: "",
        pdf: true,
        pdf_size: "4R",
    });

    const [pickupData, setPickupData] = useState({
        pickup_time: "",
        pickup_date: "",
        pickup_location: "",
        expected_package_count: 1,
    });

    const {
        checkPincodeServiceability,
        trackShipment,
        createShipment,
        editShipment,
        cancelShipment,
        updateEwaybill,
        calculateCharges,
        generatePackingSlip,
        createPickupRequest,
        isLoading,
    } = useDelhiveryApi();

    const handleCheckServiceability = async () => {
        if (!pincode) return;
        try {
            const result = await checkPincodeServiceability(pincode);
            const isServiceable =
                result.data?.delivery_codes?.some((item: any) => {
                    const details = item.postal_code;
                    return (
                        details?.pin?.toString() === pincode.toString() &&
                        details?.pre_paid === "Y" &&
                        details?.cod === "Y" &&
                        details?.cash === "Y" &&
                        details?.repl === "Y" &&
                        details?.pickup === "Y"
                    );
                }) || false;
            setServiceabilityResult(isServiceable);
        } catch (error) {
            setServiceabilityResult(false);
        }
    };

    const handleTrackShipment = async () => {
        if (!waybill) return;
        try {
            const result = await trackShipment(waybill);
            setTrackingResult(result);
        } catch (error) {
            setTrackingResult({
                error: error instanceof Error ? error.message : String(error),
            });
        }
    };

    const handleCreateShipment = async () => {
        try {
            const result = await createShipment(createShipmentData);
            alert("Shipment created successfully!");
        } catch (error) {
            alert(
                "Error creating shipment: " +
                (error instanceof Error ? error.message : String(error)),
            );
        }
    };

    const handleEditShipment = async () => {
        try {
            const result = await editShipment(editShipmentData);
            alert("Shipment updated successfully!");
        } catch (error) {
            alert(
                "Error updating shipment: " +
                (error instanceof Error ? error.message : String(error)),
            );
        }
    };

    const handleCancelShipment = async () => {
        if (!cancelWaybill) return;
        try {
            const result = await cancelShipment(cancelWaybill);
            alert("Shipment cancelled successfully!");
        } catch (error) {
            alert(
                "Error cancelling shipment: " +
                (error instanceof Error ? error.message : String(error)),
            );
        }
    };

    const handleUpdateEwaybill = async () => {
        try {
            const result = await updateEwaybill({
                waybill: ewaybillData.waybill,
                data: {
                    dcn: ewaybillData.dcn,
                    ewbn: ewaybillData.ewbn,
                },
            });
            alert("E-waybill updated successfully!");
        } catch (error) {
            alert(
                "Error updating e-waybill: " +
                (error instanceof Error ? error.message : String(error)),
            );
        }
    };

    const handleCalculateCharges = async () => {
        try {
            const result = await calculateCharges(chargesParams);
            setChargesResult(result);
        } catch (error) {
            setChargesResult({
                error: error instanceof Error ? error.message : String(error),
            });
        }
    };

    const handleGeneratePackingSlip = async () => {
        try {
            const result = await generatePackingSlip(packingSlipParams);
            setPackingSlipResult(result);

            if (packingSlipParams.pdf) {
                const blob = result instanceof Blob ? result : new Blob([result], { type: "application/pdf" });
                const header = await blob.slice(0, 4).text();

                if (!header.startsWith('%PDF')) {
                    const text = await blob.text();
                    throw new Error(`Invalid PDF response received. Server returned: ${text.slice(0, 200)}`);
                }

                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `packing-slip-${packingSlipParams.wbns}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            setPackingSlipResult({
                error: error instanceof Error ? error.message : String(error),
            });
        }
    };

    const handleCreatePickup = async () => {
        try {
            const result = await createPickupRequest(pickupData);
            alert("Pickup request created successfully!");
        } catch (error) {
            alert(
                "Error creating pickup request: " +
                (error instanceof Error ? error.message : String(error)),
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Pincode Serviceability */}
                <Card>
                    <CardHeader className="pb-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <MapPin size={16} />
                            Pincode Check
                        </h3>
                    </CardHeader>
                    <CardBody className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                PIN Code
                            </label>
                            <Input
                                value={pincode}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setPincode(e.target.value)
                                }
                                placeholder="Enter 6-digit PIN"
                                maxLength={6}
                            />
                        </div>
                        <Button
                            onClick={handleCheckServiceability}
                            disabled={!pincode || isLoading}
                            className="w-full"
                            icon={<Search size={16} className="mr-2" />}
                        >
                            Check Serviceability
                        </Button>
                        {(pincode && pincode.length === 6 && serviceabilityResult !== null && !isLoading) && (
                               <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                {serviceabilityResult ? (
                                     <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle size={16} />
                                        <span className="text-sm">Serviceable</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-600">
                                        <X size={16} />
                                        <span className="text-sm">
                                            Not Serviceable
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Track Shipment */}
                <Card>
                    <CardHeader className="pb-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <PackageIcon size={16} />
                            Track Shipment
                        </h3>
                    </CardHeader>
                    <CardBody className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Waybill Number
                            </label>
                            <Input
                                value={waybill}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setWaybill(e.target.value)
                                }
                                placeholder="Enter waybill number"
                            />
                        </div>
                        <Button
                            onClick={handleTrackShipment}
                            disabled={!waybill || isLoading}
                            className="w-full"
                            icon={<Search size={16} className="mr-2" />}
                        >
                            Track
                        </Button>
                        {trackingResult && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                                {trackingResult.error ? (
                                    <div className="text-red-600 text-sm">
                                        {trackingResult.error}
                                    </div>
                                ) : (
                                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                                        {JSON.stringify(trackingResult, null, 2)}
                                    </pre>
                                )}
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Calculate Charges */}
                <Card>
                    <CardHeader className="pb-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Calculator size={16} />
                            Calculate Charges
                        </h3>
                    </CardHeader>
                    <CardBody className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Origin PIN
                                </label>
                                <Input
                                    value={chargesParams.o_pin}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setChargesParams((prev) => ({
                                            ...prev,
                                            o_pin: e.target.value,
                                        }))
                                    }
                                    placeholder="Origin"
                                    maxLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dest PIN
                                </label>
                                <Input
                                    value={chargesParams.d_pin}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setChargesParams((prev) => ({
                                            ...prev,
                                            d_pin: e.target.value,
                                        }))
                                    }
                                    placeholder="Destination"
                                    maxLength={6}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Weight (gm)
                            </label>
                            <Input
                                type="number"
                                value={chargesParams.cgm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setChargesParams((prev) => ({
                                        ...prev,
                                        cgm: parseInt(e.target.value) || 0,
                                    }))
                                }
                                placeholder="Weight in grams"
                            />
                        </div>
                        <Button
                            onClick={handleCalculateCharges}
                            disabled={
                                !chargesParams.o_pin ||
                                !chargesParams.d_pin ||
                                !chargesParams.cgm ||
                                isLoading
                            }
                            className="w-full"
                            icon={<Calculator size={16} className="mr-2" />}
                        >
                            Calculate
                        </Button>
                        {chargesResult && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                                {chargesResult.error ? (
                                    <div className="text-red-600 text-sm">
                                        {chargesResult.error}
                                    </div>
                                ) : (
                                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                                        {JSON.stringify(chargesResult, null, 2)}
                                    </pre>
                                )}
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* Advanced Operations */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">
                    Advanced Operations
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Create Shipment */}
                    <Card>
                        <CardHeader>
                            <h3 className="flex items-center gap-2">
                                <PackageIcon size={16} />
                                Create Shipment
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Customer Name
                                    </label>
                                    <Input
                                        value={createShipmentData.customerName}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setCreateShipmentData((prev) => ({
                                                ...prev,
                                                customerName: e.target.value,
                                            }))
                                        }
                                        placeholder="Customer name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Order ID
                                    </label>
                                    <Input
                                        value={createShipmentData.orderId}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setCreateShipmentData((prev) => ({
                                                ...prev,
                                                orderId: e.target.value,
                                            }))
                                        }
                                        placeholder="Order ID"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <Input
                                    value={createShipmentData.address}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setCreateShipmentData((prev) => ({
                                            ...prev,
                                            address: e.target.value,
                                        }))
                                    }
                                    placeholder="Full address"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City
                                    </label>
                                    <Input
                                        value={createShipmentData.city}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setCreateShipmentData((prev) => ({
                                                ...prev,
                                                city: e.target.value,
                                            }))
                                        }
                                        placeholder="City"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State
                                    </label>
                                    <Input
                                        value={createShipmentData.state}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setCreateShipmentData((prev) => ({
                                                ...prev,
                                                state: e.target.value,
                                            }))
                                        }
                                        placeholder="State"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        PIN
                                    </label>
                                    <Input
                                        value={createShipmentData.pincode}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setCreateShipmentData((prev) => ({
                                                ...prev,
                                                pincode: e.target.value,
                                            }))
                                        }
                                        placeholder="PIN"
                                        maxLength={6}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <Input
                                        value={createShipmentData.phone}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setCreateShipmentData((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                            }))
                                        }
                                        placeholder="Phone"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Amount
                                    </label>
                                    <Input
                                        type="number"
                                        value={createShipmentData.totalAmount}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setCreateShipmentData((prev) => ({
                                                ...prev,
                                                totalAmount: parseFloat(e.target.value) || 0,
                                            }))
                                        }
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Items
                                    </label>
                                    <Input
                                        type="number"
                                        value={createShipmentData.totalItems}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setCreateShipmentData((prev) => ({
                                                ...prev,
                                                totalItems: parseInt(e.target.value) || 1,
                                            }))
                                        }
                                        placeholder="1"
                                        min={1}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="prepaid"
                                    checked={createShipmentData.isPrepaid}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setCreateShipmentData((prev) => ({
                                            ...prev,
                                            isPrepaid: e.target.checked,
                                        }))
                                    }
                                    className="rounded border-gray-300"
                                />
                                <label
                                    htmlFor="prepaid"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Prepaid
                                </label>
                            </div>
                            <Button
                                onClick={handleCreateShipment}
                                disabled={!createShipmentData.customerName || !createShipmentData.address || isLoading}
                                className="w-full"
                            >
                                Create Shipment
                            </Button>
                        </CardBody>
                    </Card>

                    {/* Edit Shipment */}
                    <Card>
                        <CardHeader>
                            <h3 className="flex items-center gap-2">
                                <FileText size={16} />
                                Edit Shipment
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Waybill
                                </label>
                                <Input
                                    value={editShipmentData.waybill}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setEditShipmentData((prev) => ({
                                            ...prev,
                                            waybill: e.target.value,
                                        }))
                                    }
                                    placeholder="Waybill number"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Type
                                    </label>
                                    <Select
                                        value={editShipmentData.pt}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                            setEditShipmentData((prev) => ({
                                                ...prev,
                                                pt: e.target.value,
                                            }))
                                        }
                                        options={[
                                            { value: "Pre-paid", label: "Pre-paid" },
                                            { value: "COD", label: "COD" },
                                        ]}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        COD Amount
                                    </label>
                                    <Input
                                        type="number"
                                        value={editShipmentData.cod}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setEditShipmentData((prev) => ({
                                                ...prev,
                                                cod: parseFloat(e.target.value) || 0,
                                            }))
                                        }
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Height (cm)
                                    </label>
                                    <Input
                                        type="number"
                                        value={editShipmentData.shipment_height}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setEditShipmentData((prev) => ({
                                                ...prev,
                                                shipment_height: parseFloat(e.target.value) || 0,
                                            }))
                                        }
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Weight (gm)
                                    </label>
                                    <Input
                                        type="number"
                                        value={editShipmentData.gm}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setEditShipmentData((prev) => ({
                                                ...prev,
                                                gm: parseFloat(e.target.value) || 0,
                                            }))
                                        }
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleEditShipment}
                                disabled={!editShipmentData.waybill || isLoading}
                                className="w-full"
                            >
                                Update Shipment
                            </Button>
                        </CardBody>
                    </Card>

                    {/* Cancel Shipment */}
                    <Card>
                        <CardHeader>
                            <h3 className="flex items-center gap-2">
                                <X size={16} />
                                Cancel Shipment
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Waybill Number
                                </label>
                                <Input
                                    value={cancelWaybill}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setCancelWaybill(e.target.value)
                                    }
                                    placeholder="Enter waybill to cancel"
                                />
                            </div>
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center gap-2 text-yellow-800">
                                    <AlertCircle size={16} />
                                    <span className="text-sm font-medium">Warning</span>
                                </div>
                                <p className="text-sm text-yellow-700 mt-1">
                                    This action cannot be undone. The shipment will be cancelled
                                    permanently.
                                </p>
                            </div>
                            <Button
                                onClick={handleCancelShipment}
                                disabled={!cancelWaybill || isLoading}
                                variant="danger"
                                className="w-full"
                            >
                                Cancel Shipment
                            </Button>
                        </CardBody>
                    </Card>

                    {/* Update E-waybill */}
                    <Card>
                        <CardHeader>
                            <h3 className="flex items-center gap-2">
                                <FileText size={16} />
                                Update E-waybill
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Waybill
                                </label>
                                <Input
                                    value={ewaybillData.waybill}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setEwaybillData((prev) => ({
                                            ...prev,
                                            waybill: e.target.value,
                                        }))
                                    }
                                    placeholder="Waybill number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    DCN (Invoice Number)
                                </label>
                                <Input
                                    value={ewaybillData.dcn}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setEwaybillData((prev) => ({
                                            ...prev,
                                            dcn: e.target.value,
                                        }))
                                    }
                                    placeholder="Invoice number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    EWBN (E-waybill Number)
                                </label>
                                <Input
                                    value={ewaybillData.ewbn}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setEwaybillData((prev) => ({
                                            ...prev,
                                            ewbn: e.target.value,
                                        }))
                                    }
                                    placeholder="E-waybill number"
                                />
                            </div>
                            <Button
                                onClick={handleUpdateEwaybill}
                                disabled={!ewaybillData.waybill || isLoading}
                                className="w-full"
                            >
                                Update E-waybill
                            </Button>
                        </CardBody>
                    </Card>

                    {/* Generate Packing Slip */}
                    <Card>
                        <CardHeader>
                            <h3 className="flex items-center gap-2">
                                <FileText size={16} />
                                Packing Slip
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Waybill Numbers
                                </label>
                                <Input
                                    value={packingSlipParams.wbns}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setPackingSlipParams((prev) => ({
                                            ...prev,
                                            wbns: e.target.value,
                                        }))
                                    }
                                    placeholder="Comma-separated waybills"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="packing-pdf"
                                    checked={packingSlipParams.pdf}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setPackingSlipParams((prev) => ({
                                            ...prev,
                                            pdf: e.target.checked,
                                        }))
                                    }
                                    className="rounded border-gray-300"
                                />
                                <label
                                    htmlFor="packing-pdf"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Generate PDF
                                </label>
                            </div>
                            <Button
                                onClick={handleGeneratePackingSlip}
                                disabled={!packingSlipParams.wbns || isLoading}
                                className="w-full"
                            >
                                Generate Packing Slip
                            </Button>
                        </CardBody>
                    </Card>

                    {/* Create Pickup Request */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <h3 className="flex items-center gap-2">
                                <Clock size={16} />
                                Create Pickup Request
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pickup Date
                                    </label>
                                    <Input
                                        type="date"
                                        value={pickupData.pickup_date}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setPickupData((prev) => ({
                                                ...prev,
                                                pickup_date: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pickup Time
                                    </label>
                                    <Input
                                        type="time"
                                        value={pickupData.pickup_time}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setPickupData((prev) => ({
                                                ...prev,
                                                pickup_time: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Package Count
                                    </label>
                                    <Input
                                        type="number"
                                        value={pickupData.expected_package_count}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setPickupData((prev) => ({
                                                ...prev,
                                                expected_package_count: parseInt(e.target.value) || 1,
                                            }))
                                        }
                                        min={1}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pickup Location
                                </label>
                                <Input
                                    value={pickupData.pickup_location}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setPickupData((prev) => ({
                                            ...prev,
                                            pickup_location: e.target.value,
                                        }))
                                    }
                                    placeholder="Warehouse name or location"
                                />
                            </div>
                            <Button
                                onClick={handleCreatePickup}
                                disabled={
                                    !pickupData.pickup_date ||
                                    !pickupData.pickup_time ||
                                    !pickupData.pickup_location ||
                                    isLoading
                                }
                                className="w-full"
                            >
                                Create Pickup Request
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default IntegrationsPage;
