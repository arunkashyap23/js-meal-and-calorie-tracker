//Storage Controller
const StorageCtrl = (function(){

    //Public Method
    return {
        storeItem: function(item){
            let items;

            if(localStorage.getItem('items') === null){
                items = [];

                //Push new Item
                items.push(item);

                //Set Local Storage
                localStorage.setItem('items',JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));

                //push new Item
                items.push(item);

                //Set LS
                localStorage.setItem('items',JSON.stringify(items));
            }
        },

        getItems: function(){
            let items;

            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },

        updateItemInLS: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item,index){
                if(updatedItem.id === item.id){
                    items.splice(index,1,updatedItem);
                }
            });

            localStorage.setItem('items',JSON.stringify(items));

        },


        deleteFromLS: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item,index){
                if(id === item.id){
                    items.splice(index,1);
                }
            });

            localStorage.setItem('items',JSON.stringify(items));
        },

        clearAllFromLS: function(){
            localStorage.removeItem('items');
        }
    }
})();



//Item Controller
const ItemCtrl = (function(){
    //Item Contructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure
    const data = {
        // items: [
        //     // {id:0, name:'Meal 1',calories: 12}
        // ],
        items: StorageCtrl.getItems(),
        currentItem:null,
        totalCalories:0
    }

    //Public Method
    return {
        //function to get data on the console
        logData: function(){
            return data;
        },

        addItemToList: function(name, calories){
            //Calories to Int
            calories = parseInt(calories);

            let ID;
            if(data.items.length > 0){
                //generating new id every time a new item is added
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }

            //create new Item
            newItem = new Item(ID,name,calories);

            //push new item to data.items
            data.items.push(newItem);

            return newItem;
        },

        updateItem: function(name, calories){
            //calories to int
            calories = parseInt(calories);

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },

        deleteItemById: function(id){
            //Get ids
            const ids = data.items.map(function(item){
                return item.id;
            });

            //Get Index
            const index = ids.indexOf(id);

            //Remove item from Data Structure
            data.items.splice(index,1);
        },

        clearAllItem: function(){
            data.items = [];
        },

        getItemById: function(id){
            let found = null;

            data.items.forEach(function(item){
                if(item.id === id){
                    found=item;
                }
            });
            return found;
        }, 

        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(function(item){
                total += item.calories;
            });

            data.totalCalories = total;

            return data.totalCalories;
        },

        setCurrentItem: function(item){
            data.currentItem = item;
        },

        getCurrentItem: function(){
            return data.currentItem;
        },

        getItems: function(){
            return data.items;
        }
    }
})();



//UI Controller
const UICtrl = (function(){
    //UI Selectors
    const UISelectors = {
        ulListItem: '#item-list',
        liAll: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        totalCalories: '.total-calories',
        nameInput: '#item-name',
        caloriesInput: '#item-calories'
    }

    //Public Method
    return {
    //Populate List Item
    populateListItem : function(listItems){
        let html = '';

        listItems.forEach(function(item){
            html += `
            <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
            `;
        });

        //insert list items into ul tag
        document.querySelector(UISelectors.ulListItem).innerHTML = html;
    },

    getInput: function(){
        return {
            name: document.querySelector(UISelectors.nameInput).value,
            calories: document.querySelector(UISelectors.caloriesInput).value
        }
    },

    NewItemToList: function(item){
        //Show list
        document.querySelector(UISelectors.ulListItem).style.display = 'block';

        //create li element
        const li = document.createElement('li');

        //Add Class Name
        li.className = 'collection-item'

        //Add Id
        li.id = `item-${item.id}`;

        //Add HTML
        li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
        `;

        //insert item
        document.querySelector(UISelectors.ulListItem).insertAdjacentElement('beforeend',li);
    },

    addItemToForm: function(){
        document.querySelector(UISelectors.nameInput).value = ItemCtrl.getCurrentItem().name,

        document.querySelector(UISelectors.caloriesInput).value = ItemCtrl.getCurrentItem().calories,

        UICtrl.showEditState();
    },

    updateItemToUI: function(item){
        let listItems = document.querySelectorAll(UISelectors.liAll);

        //Turns Node into array
        listItems = Array.from(listItems);

        listItems.forEach(function(listItem){
            const listId = listItem.getAttribute('id');

            if(listId === `item-${item.id}`){
                document.querySelector(`#${listId}`).innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
                `;
            }
        });
    },

    deleteItem: function(id){
        const itemId = `#item-${id}`;
        const item = document.querySelector(itemId);
        item.remove();
    },

    clearAllItemFromUI: function(){
        let list = document.querySelectorAll(UISelectors.liAll);

        //Turn Node into Array
        list = Array.from(list);

        list.forEach(function(item){
            item.remove();
        });
    },

    clearInputFields: function(){
        document.querySelector(UISelectors.nameInput).value='',
        document.querySelector(UISelectors.caloriesInput).value = ''
    },

    showTotalCalories: function(totalCalories){
        document.querySelector(UISelectors.totalCalories).textContent = totalCalories
    },

    clearEditState: function(){
        UICtrl.clearInputFields();
        document.querySelector(UISelectors.addBtn).style.display = 'inline',
        document.querySelector(UISelectors.updateBtn).style.display = 'none',
        document.querySelector(UISelectors.deleteBtn).style.display = 'none',
        document.querySelector(UISelectors.backBtn).style.display = 'none'
    },

    showEditState: function(){
        document.querySelector(UISelectors.addBtn).style.display = 'none',
        document.querySelector(UISelectors.updateBtn).style.display = 'inline',
        document.querySelector(UISelectors.deleteBtn).style.display = 'inline',
        document.querySelector(UISelectors.backBtn).style.display = 'inline'
    },

    hideList: function(){
        document.querySelector(UISelectors.ulListItem).style.display = 'none';
    },

    getSelectors: function(){
        return UISelectors;
    }
    }
})();




//App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    //UI Selectors
    const UISelectors = UICtrl.getSelectors();

    //load event listeners
    const loadEventListeners = function(){
        //Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

        //Disable Enter key on Submit
        document.addEventListener('keypress',function(e){
            if(e.key === 'Enter'){
                e.preventDefault();
                return false;
            }
        });

        //click item event
        document.querySelector(UISelectors.ulListItem).addEventListener('click',clickItemEvent);

        //Update Item Event
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

        //Back Button Event
        document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);

        //Delete Item Event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteEvent);

        //clear all Item Event
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllEvent);
    }

    //Item Add Submit
    const itemAddSubmit = function(e){
        //Get Input Fields
        const input = UICtrl.getInput();

        //check if name and calories is empty 
        if(input.name !== '' && input.calories !== ''){
        //Add item to List 
        const newItem = ItemCtrl.addItemToList(input.name, input.calories);

        //Add Item To UI
        UICtrl.NewItemToList(newItem);

        //Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Show Total Calories
        UICtrl.showTotalCalories(totalCalories);

        //Store Item in Local Storage
        StorageCtrl.storeItem(newItem);

        //Clear Input Fields
        UICtrl.clearInputFields();
        }

        e.preventDefault();
    }

    //Click Item Event
    const clickItemEvent = function(e){
        if(e.target.classList.contains('edit-item')){
            //Get list Id
            const listId = e.target.parentNode.parentNode.id;

            //Break into Array
            const listIdArr = listId.split('-');

            //Get Actual ID
            const actualId = parseInt(listIdArr[1]);

            //Get Item by ID
            const item = ItemCtrl.getItemById(actualId);

            //Set Current Item
            ItemCtrl.setCurrentItem(item);

            //Add Item to Form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    //Update Item Submit
    const itemUpdateSubmit = function(e){
        //Get Input Item
        const item = UICtrl.getInput();

        //Update item
        const updatedItem = ItemCtrl.updateItem(item.name, item.calories);

        //Add Updated Item to UI
        UICtrl.updateItemToUI(updatedItem);

        //Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Show Total Calories
        UICtrl.showTotalCalories(totalCalories);

        //Update Item in LS
        StorageCtrl.updateItemInLS(updatedItem);

        //Clear Edit State
        UICtrl.clearEditState();


        e.preventDefault();
    }

    //Delete Item Event
    const itemDeleteEvent = function(e){
        
        //Get Current Item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete item by Id
        ItemCtrl.deleteItemById(currentItem.id);

        //Delete Item from UI
        UICtrl.deleteItem(currentItem.id);

        //Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Show Total Calories
        UICtrl.showTotalCalories(totalCalories);

        //Delete from LS
        StorageCtrl.deleteFromLS(currentItem.id);

        //clear Edit State
        UICtrl.clearEditState();


        e.preventDefault();
    }

    //Clear All Event
    const clearAllEvent = function(){

        //clear all items from Item Ctrl
        ItemCtrl.clearAllItem();

        //Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Show Total Calories
        UICtrl.showTotalCalories(totalCalories);

        //Clear All items from UI
        UICtrl.clearAllItemFromUI();

        //Clear All Items from LS
        StorageCtrl.clearAllFromLS();

        //Hide List
        UICtrl.hideList();
    }


    //Public Method
    return {
        init: function(){
            //Clear Edit State
            UICtrl.clearEditState();
            //Get Items
            const listItems = ItemCtrl.getItems();

            if(listItems.length === 0){
                UICtrl.hideList();
            }else{
                //Populate list to UI
                UICtrl.populateListItem(listItems);
            }

            //Get Total Calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Show Total Calories
            UICtrl.showTotalCalories(totalCalories);

            //load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl,UICtrl);
App.init();