document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('estimateForm');
    const totalDisplay = document.getElementById('totalDisplay');
    const basicPriceDisplay = document.getElementById('basicPriceDisplay');
    const addPriceDisplay = document.getElementById('addPriceDisplay');
    const qFabricColorSection = document.getElementById('qFabricColorSection');
    const qPrintSizeSection = document.getElementById('qPrintSizeSection');

    const labelAddNone = document.querySelector('label[for="addNone"]');

    const updateVisibility = () => {
        if (form.colorScheme.value === 'inkjet') {
            qFabricColorSection.classList.remove('hidden');
            if (form.fabricColor.value === 'color') {
                qPrintSizeSection.classList.remove('hidden');
            } else {
                qPrintSizeSection.classList.add('hidden');
            }
            labelAddNone.textContent = '追加はなし';
        } else {
            qFabricColorSection.classList.add('hidden');
            qPrintSizeSection.classList.add('hidden');
            labelAddNone.textContent = '追加はなし。1か所1色は無料内！';
        }
    };
    
    form.querySelectorAll('input[name="colorScheme"]').forEach(input => input.addEventListener('change', updateVisibility));
    form.querySelectorAll('input[name="fabricColor"]').forEach(input => input.addEventListener('change', updateVisibility));

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

    const getFullColorPrice = (quantity, fabric, size) => {
        // Thresholds: 70, 50, 30, 20, 15, 13, 10, 7, 4, 1
        const thresholds = [70, 50, 30, 20, 15, 13, 10, 7, 4, 1];
        
        let basePrices, addPrices;
        if (fabric === 'white') {
            basePrices = [1030, 1050, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800];
            addPrices = [330, 350, 400, 500, 600, 700, 800, 900, 1000, 1100];
        } else {
            if (size === '10') {
                basePrices = [1230, 1250, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000];
                addPrices = [530, 550, 600, 700, 800, 900, 1000, 1100, 1200, 1300];
            } else if (size === '20') {
                basePrices = [1430, 1450, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200];
                addPrices = [730, 750, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500];
            } else {
                basePrices = [1630, 1650, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400];
                addPrices = [930, 950, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700];
            }
        }
        
        for (let i = 0; i < thresholds.length; i++) {
            if (quantity >= thresholds[i]) {
                return { base: basePrices[i], add: addPrices[i] };
            }
        }
        return { base: basePrices[basePrices.length - 1], add: addPrices[addPrices.length - 1] };
    };

    const calculate = () => {
        const colorScheme = form.colorScheme.value;
        const fabricColor = form.fabricColor.value;
        const printSize = form.printSize.value;
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

        let basicUnitPrice = 0;
        let addPrintUnitPrice = 0;

        if (colorScheme === 'silk') {
            basicUnitPrice = getBasicPrice(itemType, quantity);
            addPrintUnitPrice = getAdditionalPrintPrice(addPrint, quantity);
        } else {
            // Full color (inkjet) calculation
            const fc = getFullColorPrice(quantity, fabricColor, printSize);
            
            // Calculate item diff (using base item1 silk price as baseline)
            const itemBasePrices = {
                item1: [1750, 1550, 1500, 1400, 1300, 1250, 1200, 1150],
                item2: [1850, 1650, 1600, 1500, 1400, 1350, 1300, 1250],
                item3: [1550, 1350, 1300, 1200, 1100, 1075, 1040, 1000],
                item4: [2250, 2050, 2000, 1900, 1800, 1700, 1650, 1620],
                item5: [1950, 1750, 1700, 1600, 1500, 1400, 1350, 1320],
                item6: [1850, 1650, 1600, 1500, 1400, 1300, 1250, 1220],
                item7: [2050, 1850, 1800, 1700, 1600, 1500, 1450, 1420]
            };
            const defaultItemPrice = itemBasePrices['item1'][0];
            const currentItemPrice = itemBasePrices[itemType] ? itemBasePrices[itemType][0] : defaultItemPrice;
            const itemDiff = currentItemPrice - defaultItemPrice;
            
            // 利益（300円）をインクジェット価格に上乗せ
            const INKJET_MARGIN = 300;
            basicUnitPrice = fc.base + itemDiff + INKJET_MARGIN;
            
            if (addPrint === 'back') {
                addPrintUnitPrice = fc.add;
            } else if (addPrint === 'sleeve') {
                // Approximate sleeve price as slightly less or equal to back. Use the full color add price.
                addPrintUnitPrice = fc.add;
            }
        }

        const bagUnitPrice = bag === 'yes' ? 50 : 0;
        const tagUnitPrice = tag === 'yes' ? 400 : 0;
        const totalUnitPrice = basicUnitPrice + addPrintUnitPrice + bagUnitPrice + tagUnitPrice;
        const grandTotal = totalUnitPrice * quantity;
        
        totalDisplay.textContent = grandTotal.toLocaleString();
        basicPriceDisplay.textContent = (basicUnitPrice).toLocaleString();
        addPriceDisplay.textContent = (addPrintUnitPrice + bagUnitPrice + tagUnitPrice).toLocaleString();
    };
    form.addEventListener('input', calculate);
    form.addEventListener('change', calculate);
    
    // Initial setup
    updateVisibility();
    calculate();
});
