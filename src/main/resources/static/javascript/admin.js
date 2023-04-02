$(document).ready(function() {
    // получение и вывод списка пользователей
    async function getUsers() {
        const rolesObj = await getRolesObj()

        fetch('http://localhost:8080/admin/users')
            .then(response => response.json())
            .then(users => {
                let tbody = $('#usersTableBody');
                tbody.empty();

                fetch('http://localhost:8080/admin/roles')

                users.forEach(user => {
                    let roles = user.roles.map(role => role.name).join(' ');
                    let row = $('<tr>');
                    row.append($('<td>').text(user.id));
                    row.append($('<td>').text(user.name));
                    row.append($('<td>').text(user.email));
                    row.append($('<td>').text(roles));
                    const editButton = $('<button>').addClass('btn btn-info edit-btn')
                        .text('Edit')
                        .attr('data-bs-toggle', 'modal')
                        .attr('data-bs-target', '#editModal')
                        .attr('data-id', user.id)
                        .attr('data-name', user.name)
                        .attr('data-email', user.email)
                        .attr('data-password', user.password)
                        // .attr('data-roles', rolesObj)
                        .attr('data-roles', JSON.stringify(rolesObj))
                        .click(function() {
                        const id = $(this).data('id');
                        const name = $(this).data('name');
                        const email = $(this).data('email');
                        const password = $(this).data('password');
                        const roles = $(this).data('roles');
                        openEditModal(id, name, email, password, roles);
                    });
                    const deleteButton = $('<button>').addClass('btn btn-danger delete-btn')
                        .text('Delete')
                        .attr('data-id', user.id)
                        .click(onDeleteButtonClick);

                    row.append($('<td>').append(editButton))
                    row.append($('<td>').append(deleteButton))
                    tbody.append(row);
                });
            });
    }

    // получение и вывод списка ролей
    function getRoles() {
        fetch('/admin/roles')
            .then(response => response.json())
            .then(roles => {
                const select = $('#roles');
                select.empty();
                roles.forEach(role => {
                    const option = $('<option>')
                        .attr('value', role.id)
                        .text(role.name);
                    select.append(option);
                });
            });
    }

    function getRolesObj() {
        return fetch('/admin/roles')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }
    // добавление нового пользователя

    $('#addUserForm').submit(function(event) {
        event.preventDefault();
        const formData = {
            name: $('#editName').val(),
            email: $('#editEmail').val(),
            password: $('#editPassword').val(),
            roles: $('#roles').val()
        };
        $.ajax({
            url: '/admin/create',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'X-CSRF-TOKEN': $('input[name="_csrf"]').val()
            },
            data: JSON.stringify(formData),
            success: async function (user) {
                const rolesObj = await getRolesObj()
                const roles = user.roles.map(role => role.name).join(' ');
                const row = $('<tr>');
                row.append($('<td>').text(user.id));
                row.append($('<td>').text(user.name));
                row.append($('<td>').text(user.email));
                row.append($('<td>').text(roles));

                const editButton = $('<button>')
                    .addClass('btn btn-info')
                    .attr('type', 'button')
                    .attr('data-bs-toggle', 'modal')
                    .attr('data-bs-target', '#editUser' + user.id)
                    .text('edit')
                    .attr('data-roles', JSON.stringify(rolesObj))
                    .click(function () {
                        const id = $(this).data('id');
                        const name = $(this).data('name');
                        const email = $(this).data('email');
                        const password = $(this).data('password');
                        const roles = $(this).data('roles');
                        openEditModal(id, name, email, password, roles);
                    });
                ;

                const deleteButton = $('<button>')
                    .addClass('btn btn-danger')
                    .attr('type', 'button')
                    // .attr('data-bs-toggle', 'modal')
                    // .attr('data-bs-target', '#userDelete' + user.id)
                    .attr('data-id', user.id)
                    .text('delete')
                    .click(onDeleteButtonClick);

                row.append($('<td>').append(editButton));
                row.append($('<td>').append(deleteButton));
                $('#usersTableBody').append(row);
                $('#addUserForm').trigger('reset');
                $('#addModal').modal('hide');
            }
        });
    });

    function onDeleteButtonClick() {
        var userId = $(this).data('id');
        $.ajax({
            url: '/admin/delete',
            type: 'POST',
            headers: {
                'X-CSRF-TOKEN': $('input[name="_csrf"]').val()
            },
            data: { id: userId },
            success: function() {
                // Обновление списка пользователей после удаления
                getUsers();
            },
            error: function() {
                alert('Failed to delete user.');
            }
        });
    }

    function openEditModal(id, name, email, password, roles) {
        // Заполнение полей ввода данными из параметров
        $('#userIdInput').val(id);
        $('#userNameInput').val(name);
        $('#userEmailInput').val(email);
        $('#userPasswordInput');

        const userRolesInput = $('#userRolesInput');
        userRolesInput.empty();

        // Заполнение селектора ролями
        roles.forEach(function(role) {
            const option = $('<option>').attr('value', JSON.stringify(role)).text(role.name);
            userRolesInput.append(option);
        });

        // Установка обработчика событий на кнопку "Save Changes"
        $('#saveChangesBtn').off('click').on('click', function() {
            const userRoles = [];
            userRolesInput.find('option:selected').each(function() {
                userRoles.push(JSON.parse($(this).val()));
            });

            // Создание объекта с новыми данными пользователя, включая роли
            const data = {
                id: id,
                name: $('#userNameInput').val(),
                email: $('#userEmailInput').val(),
                password: $('#userPasswordInput').val(),
                roles: userRoles
            };

            // Отправка данных на сервер
            fetch(`http://localhost:8080/admin/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('input[name="_csrf"]').val()
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => {
                    getUsers();
                    $('#editModal').modal('hide');
                })
                .catch(error => console.error(error));
        });
    }




    /*function openEditModal(id, name, email, roles) {
        console.log("152 Роли, которые передали в параметрах " + roles)
        // заполнение полей ввода данными из параметров
        $('#userIdInput').val(id);
        $('#userNameInput').val(name);
        $('#userEmailInput').val(email);
        $('#userRolesInput').val(roles);

        // установка обработчика событий на кнопку "Save Changes"
        $('#saveChangesBtn').off('click').on('click', function() {
            const userId = $('#userIdInput').val();
            const userName = $('#userNameInput').val();
            const userEmail = $('#userEmailInput').val();
            // const userRoles = $('#userRolesInput').val().split(' ');
            const userRolesInput = $('#userRolesInput');
            userRolesInput.empty();
            roles.forEach(function(role) {
                console.log("vnutri for each ----------------")
                console.log(role)
                const option = $('<option>').attr('value', JSON.stringify(role)).text(role.name);
                userRolesInput.append(option);
            });
            userRolesInput.trigger('change');
            const userRoles = userRolesInput.val();
            console.log("181 stroka -----------------")
            console.log(userRoles)
            const data = {
                id: userId,
                name: userName,
                email: userEmail,
                roles: userRoles.split(' ')
            };
            console.log("send data -----------------")
            console.log(data)
            // выполнение POST-запроса на сервер
            fetch(`http://localhost:8080/admin/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('input[name="_csrf"]').val()
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => {
                    // обновление таблицы пользователей
                    getUsers();
                    // закрытие модального окна
                    $('#editModal').modal('hide');
                })
                .catch(error => console.error(error));
        });
    }*/



    /*function openEditModal(id, name, email, roles) {
        const modal = $('#editModal');
        modal.find('#editId').val(id);
        modal.find('#editName').val(name);
        modal.find('#editEmail').val(email);
        const rolesArray = roles.split(' ');
        modal.find('#roles option').each(function() {
            $(this).prop('selected', rolesArray.includes($(this).text()));
        });
        modal.modal('show');
    }*/










    /*// Находим модальное окно редактирования по ID
    const editModal = $('#editModal');

// Находим форму редактирования внутри модального окна
    const editForm = editModal.find('form');

// Обработчик нажатия кнопки "Edit"
    function onEditButtonClick(event) {
        // Получаем данные пользователя из атрибутов кнопки
        const id = $(event.target).data('id');
        const name = $(event.target).data('name');
        const email = $(event.target).data('email');
        const roles = $(event.target).data('roles').split(' ');

        // Заполняем поля формы редактирования данными пользователя
        editForm.find('#editId').val(id);
        editForm.find('#editName').val(name);
        editForm.find('#editEmail').val(email);
        editForm.find('#roles option').each((index, option) => {
            $(option).prop('selected', roles.includes($(option).text()));
        });

        // Открываем модальное окно редактирования
        editModal.modal('show');
    }

// Находим все кнопки "Edit" и добавляем обработчик нажатия на каждую из них
    $('.edit-btn').click(onEditButtonClick);*/


    getUsers();
    getRoles();
})


