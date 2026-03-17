document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('estimateForm');
    const totalDisplay = document.getElementById('totalDisplay');
    const basicPriceDisplay = document.getElementById('basicPriceDisplay');
    const addPriceDisplay = document.getElementById('addPriceDisplay');

    const getBasicPrice = (itemType, quantity) => {
        if (!itemType || !quantity) return 0;
        const priceTable = {
            item1: [1750, 1550, 1500, 1400, 1300, 1250, 1200, 1150],
            item2: [1850, 1650, 1600, 1500, 1400, 1350, 1300, 1250],
            item3: [1550, 1350, 1300, 1200, 1100, 1075, 1040, 1000],
            item4: [2250, 2050, 2000, 1900, 1800, 1700, 1650, 1620],
            item5: [1950, 1750, 1700, 1600, 1500, 1400, 1350, 1320],
            item6: [1850, 1650, 1600, 1500, 1400, 1300, 1250, 1220],
            item7: [2050, 1850, 1800, 1700, 1600, 1500, 1450, 1420]
        };
        const prices = priceTable[itemType];
        if (!prices) return 1500;
        if (quantity >= 200) return prices[7];
        if (quantity >= 150) return prices[6];
        if (quantity >= 100) return prices[5];
        if (quantity >= 50) return prices[4];
        if (quantity >= 30) return prices[3];
        if (quantity >= 20) return prices[2];
        if (quantity >= 15) return prices[1];
        if (quantity >= 10) return prices[0];
        return prices[0] + 500;
    };

    const getAdditionalPrintPrice = (type, quantity) => {
        if (type === 'none') return 0;
        const backPrint = [1100, 900, 780, 660, 570, 450, 420, 400];
        const sleevePrint = [900, 800, 700, 650, 570, 450, 420, 400];
        const prices = (type === 'back') ? backPrint : sleevePrint;
        if (quantity >= 200) return prices[7];
        if (quantity >= 150) return prices[6];
        if (quantity >= 100) return prices[5];
        if (quantity >= 50) return prices[4];
        if (quantity >= 30) return prices[3];
        if (quantity >= 20) return prices[2];
        if (quantity >= 15) return prices[1];
        if (quantity >= 10) return prices[0];
        return prices[0] + 200;
    };

    const calculate = () => {
        const itemType = form.itemType.value;
        const quantity = parseInt(form.quantity.value) || 0;
        const addPrint = form.addPrint.value;
        const bag = form.bag.value;
        const tag = form.tag.value;
        if (quantity <= 0) {
            totalDisplay.textContent = '0';
            basicPriceDisplay.textContent = '0';
            addPriceDisplay.textContent = '0';
            return;
        }
        const basicUnitPrice = getBasicPrice(itemType, quantity);
        const addPrintUnitPrice = getAdditionalPrintPrice(addPrint, quantity);
        const bagUnitPrice = bag === 'yes' ? 50 : 0;
        const tagUnitPrice = tag === 'yes' ? 400 : 0;
        const totalUnitPrice = basicUnitPrice + addPrintUnitPrice + bagUnitPrice + tagUnitPrice;
        const grandTotal = totalUnitPrice * quantity;
        totalDisplay.textContent = grandTotal.toLocaleString();
        basicPriceDisplay.textContent = basicUnitPrice.toLocaleString();
        addPriceDisplay.textContent = (addPrintUnitPrice + bagUnitPrice + tagUnitPrice).toLocaleString();
    };
    form.addEventListener('input', calculate);
    form.addEventListener('change', calculate);
});
